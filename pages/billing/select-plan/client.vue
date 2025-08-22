<script setup lang="ts">
import PricingPlanCard from '@/components/reka/ClientPricingPlanCard.vue'
import { useAuthUser } from '@/composables/useAuthUser'
import { loadConfig } from "@/configuration/ConfigLoader"
import { useRequestHeaders } from 'nuxt/app'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// ---- Types that match backend ----
type PlanFeatures = {
  maxActiveQuests?: number
  devPool?: 'auto' | 'invite'
  estimations?: boolean
  canCustomizeLevelThresholds?: boolean
  boostQuests?: boolean
  showOnLeaderBoard?: boolean
  communicateWithClient?: boolean
}

type PricingPlanRow = {
  planId: string
  name: string
  description?: string
  stripePriceId?: string
  features: PlanFeatures
  price: number
  interval: string
  isActive: boolean
  createdAt: string
}

type PlanSnapshot = {
  userId: string
  planId: string
  status: 'Active' | 'Trialing' | 'PastDue' | 'Canceled' | 'Incomplete' | 'IncompleteExpired' | 'Paused' | 'Unpaid'
  features: PlanFeatures
  currentPeriodEnd?: string | null
  cancelAtPeriodEnd?: boolean        // 👈 Add this!
}

// ---- Your display types stay the same ----
type Tier = 'free' | 'starter' | 'growth' | 'scale'
type PlanDisplay = {
  name: string
  tier: Tier
  price: string
  description: string
  maxActiveQuests: string
  devPool: string
  estimations: boolean
  ctaLabel?: string
  canCustomizeLevelThresholds: boolean
  boostQuests: boolean
}
interface Plan extends PlanDisplay { planId: string }

// ---- Runtime config / helpers ----
const router = useRouter()
const headers = useRequestHeaders(['cookie'])
// const baseUrl = useRuntimeConfig().public.backendBaseUrl // e.g. http://localhost:8080/dev-quest-service

const config = loadConfig();
const baseUrl = config.devQuestBackend.baseUrl.replace(/\/$/, "");

// You likely already have this from /api/auth/session
const { data: user, pending: authPending } = useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

// Map backend plan -> card model
function toDisplay(p: PricingPlanRow): Plan {
  // very naive tier mapping; adjust to your IDs/names
  const tier: Tier =
    p.planId.toLowerCase().includes('free') ? 'free' :
      p.planId.toLowerCase().includes('starter') ? 'starter' :
        p.planId.toLowerCase().includes('growth') ? 'growth' :
          'scale'

  return {
    planId: p.planId,
    name: p.name,
    tier,
    price: p.price === 0 ? '$0' : `$${p.price}/month`,
    description: p.description ?? '',
    maxActiveQuests: String(p.features.maxActiveQuests ?? '—'),
    devPool: p.features.devPool === 'invite' ? 'Invite & assign devs' : 'Auto‑match only',
    estimations: !!p.features.estimations,
    canCustomizeLevelThresholds: !!p.features.canCustomizeLevelThresholds,
    boostQuests: !!p.features.boostQuests,
    ctaLabel: p.price === 0 ? 'Get started' : undefined,
  }
}

// ---- API calls ----
async function fetchPlans(): Promise<Plan[]> {
  const raw = await $fetch<PricingPlanRow[]>(`${baseUrl}/billing/plans/${encodeURIComponent(safeUserId.value)}`, {
    credentials: 'include',
    // headers
  })
  return raw.map(toDisplay)
}

async function fetchMyPlan(): Promise<PlanSnapshot | null> {
  if (!safeUserId.value) return null
  return await $fetch<PlanSnapshot>(`${baseUrl}/billing/me/plan/${encodeURIComponent(safeUserId.value)}`, {
    credentials: 'include',
    // headers
  })
}

async function createCheckout(planId: string): Promise<{ url?: string } | PricingPlanRow> {
  // If plan is paid, backend returns { url }; if free, it returns the updated row (or 200)
  return await $fetch(`${baseUrl}/billing/checkout/${encodeURIComponent(safeUserId.value)}`, {
    method: 'POST',
    body: { planId },
    credentials: 'include',
    // headers
  })
}

// ---- State ----
const loading = ref(true)
const creating = ref(false)
const error = ref<string | null>(null)

const myPlan = ref<PlanSnapshot | null>(null)
const plans = ref<Plan[]>([])
const selectedPlanId = ref<string | null>(null)
const currentPlanId = ref<string | null>(null)

const selectedPlan = computed(() => plans.value.find(p => p.planId === selectedPlanId.value) || null)
const isSelectingCurrent = computed(() => selectedPlanId.value && selectedPlanId.value === currentPlanId.value)

const primaryCta = computed(() => {
  if (!selectedPlan.value) return 'Continue'
  if (isSelectingCurrent.value) return 'Current plan'
  return selectedPlan.value.tier === 'free' ? 'Switch to Free' : `Switch to ${selectedPlan.value.name}`
})

const isViewingCurrentPlan = computed(() =>
  myPlan.value?.planId === selectedPlanId.value
)


// ---- Lifecycle ----
async function loadPage() {
  loading.value = true
  error.value = null
  try {
    const [planList, snap] = await Promise.all([fetchPlans(), fetchMyPlan()])
    plans.value = planList
    myPlan.value = snap                     // 👈 Set plan snapshot

    console.log(myPlan.value)
    currentPlanId.value = snap?.planId ?? null
    selectedPlanId.value = currentPlanId.value || (plans.value[0]?.planId ?? null)
  } catch (e: any) {
    console.error(e)
    error.value = e?.data?.message || 'Failed to load plans. Please try again.'
  } finally {
    loading.value = false
  }
}

async function proceed() {
  if (!selectedPlan.value || isSelectingCurrent.value || !safeUserId.value) return
  creating.value = true
  error.value = null
  try {
    const res = await createCheckout(selectedPlan.value.planId)
    // Paid plan -> {url}; Free plan -> updated row (no url)
    if ((res as any)?.url) {
      window.location.href = (res as any).url as string
    } else {
      // switched to free instantly; refresh
      await loadPage()
    }
  } catch (e: any) {
    console.error(e)
    error.value = e?.data?.message || 'Could not start checkout. Please try again.'
  } finally {
    creating.value = false
  }
}

async function openBillingPortal() {
  if (!safeUserId.value) return
  const { url } = await $fetch<{ url: string }>(
    `${baseUrl}/billing/portal/${encodeURIComponent(safeUserId.value)}`,
    { method: 'POST', credentials: 'include' }
  )
  window.location.href = url
}

async function cancelPlan() {
  if (!safeUserId.value) return
  try {
    await $fetch(`${baseUrl}/billing/cancel/${encodeURIComponent(safeUserId.value)}`, {
      method: 'POST',
      credentials: 'include'
    })
    await loadPage() // reload plan info to reflect cancel_at_period_end
  } catch (e) {
    console.error("Failed to cancel plan:", e)
  }
}

async function resumePlan() {
  if (!safeUserId.value) return
  creating.value = true
  error.value = null
  try {
    await $fetch(`${baseUrl}/billing/resume/${encodeURIComponent(safeUserId.value)}`, {
      method: 'POST',
      credentials: 'include',
    })
    await loadPage()
  } catch (e: any) {
    console.error(e)
    error.value = e?.data?.message || 'Could not resume your plan.'
  } finally {
    creating.value = false
  }
}


function choose(planId: string) {
  selectedPlanId.value = planId
}

onMounted(loadPage)
</script>

<style scoped>
/***** Optional: subtle hover lift for cards *****/
button> :deep(section) {
  transition: transform 120ms ease, box-shadow 120ms ease;
}

button:hover> :deep(section) {
  transform: translateY(-2px);
}
</style>

<template>
  <NuxtLayout>
    <section class="max-w-7xl mx-auto px-4 py-12">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-black dark:text-white">Select your plan</h1>
        <p class="mt-2 text-black/80 dark:text-white/80">
          Choose the plan that fits your workflow. You can change plans anytime.
        </p>
      </div>

      <!-- Loading / Error states -->
      <div v-if="loading" class="grid md:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="h-56 rounded-xl bg-black/5 dark:bg-white/10 animate-pulse" />
      </div>

      <div v-else>

        <p v-if="error" class="mb-4 text-red-600 dark:text-red-400">{{ error }}</p>

        <!-- Sticky footer action -->
        <div
          class="sticky bottom-0 rounded-lg mt-10 mb-10 border border-black/80 bg-white/70 dark:bg-zinc-700 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-zinc-700">
          <div class="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div class="text-base text-black dark:text-white">
              <template v-if="selectedPlan">
                <strong class="text-black dark:text-white">{{ selectedPlan.name }}</strong>
                <span class="mx-2">•</span>
                <span>{{ selectedPlan.price }}</span>
              </template>
              <template v-else>
                Select a plan to continue
              </template>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">

              <button v-if="myPlan?.status === 'Active' && myPlan?.cancelAtPeriodEnd && isViewingCurrentPlan && myPlan.planId !== 'PLAN001'" @click="resumePlan"
                class="px-5 py-2.5 rounded bg-emerald-600 text-white font-medium shadow hover:bg-emerald-500 w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed">
                Resume Plan
              </button>

              <button v-if="myPlan?.status === 'Active' && !myPlan?.cancelAtPeriodEnd && isViewingCurrentPlan && myPlan.planId !== 'PLAN001'" @click="cancelPlan"
                class="px-5 py-2.5 rounded bg-red-600 text-white font-medium shadow hover:bg-red-500 w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed">
                Cancel at period end
              </button>

              <button type="button"
                class="px-5 py-2.5 rounded bg-indigo-600 text-white font-medium shadow hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto"
                :disabled="!selectedPlan || isSelectingCurrent || creating" 
                @click="proceed"
                >
                <span v-if="creating" class="animate-pulse">Processing…</span>
                <span v-else>{{ primaryCta }}</span>
              </button>
            </div>
          </div>
        </div>


        <!-- Plans grid -->
        <div class="grid md:grid-cols-4 gap-6 items-stretch">

          <div v-for="plan in plans" :key="plan.planId" class="relative group">
            <!-- Selection ring -->
            <div class="absolute -inset-0.5 rounded-2xl transition shadow-sm"
              :class="selectedPlanId === plan.planId ? 'ring-2 ring-indigo-500/70 dark:ring-indigo-500' : 'ring-1 ring-black/20 dark:ring-white/50'" />

            <!-- Current badge -->
            <div v-if="plan.planId === currentPlanId" class="absolute top-3 right-3 z-10">
              <span class="text-xs px-2 py-1 rounded bg-emerald-600 text-white">Current</span>
            </div>

            <button type="button" @click="choose(plan.planId)"
              class="relative z-0 w-full h-full text-left rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
              <PricingPlanCard :plan="plan" class="h-full" />
            </button>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
