<script setup lang="ts">
import PricingPlanCard from '@/components/reka/DevPricingPlanCard.vue'; // you can rename to DevPricingPlanCard if you want
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// ---- Types ---------------------------------------------------------------

type Tier = 'free' | 'freelancer' | 'pro' | ''

type PlanDisplay = {
  name: string
  price: string
  description: string
  maxConcurrentQuests: string
  tier: Tier
  ctaLabel?: string
  showOnLeaderBoard: boolean
  communicateWithClient: boolean
}

interface Plan extends PlanDisplay {
  planId: string
}

// ---- Mock API ------------------------------------------------------------

function mockFetchPlans(): Promise<Plan[]> {
  const data: Plan[] = [
    {
      planId: 'dev_free',
      name: 'Free',
      tier: 'free',
      price: '$0',
      description: 'Browse quests, apply to a limited number of quests.',
      maxConcurrentQuests: '2',
      ctaLabel: 'Get started',
      showOnLeaderBoard: false,
      communicateWithClient: false,
    },
    {
      planId: 'dev_freelancer',
      name: 'Freelancer',
      tier: 'freelancer',
      price: '$30/month',
      description: 'For active freelancers who want to apply more and get seen.',
      maxConcurrentQuests: '10',
      showOnLeaderBoard: true,
      communicateWithClient: false,
    },
    {
      planId: 'dev_pro',
      name: 'Pro',
      tier: 'pro',
      price: '$50/month',
      description: 'For super active pros.',
      maxConcurrentQuests: '20',
      showOnLeaderBoard: true,
      communicateWithClient: true,
    },
  ]
  return new Promise((resolve) => setTimeout(() => resolve(data), 300))
}

function mockGetCurrentPlan(): Promise<{ planId: string }> {
  return new Promise((resolve) => setTimeout(() => resolve({ planId: 'dev_free' }), 200))
}

function mockCreateCheckoutSession(planId: string): Promise<{ url: string }> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ url: `/billing/dev-checkout?plan=${planId}` }), 400)
  )
}

// ---- State ---------------------------------------------------------------

const router = useRouter()
const loading = ref(true)
const creating = ref(false)
const error = ref<string | null>(null)

const plans = ref<Plan[]>([])
const selectedPlanId = ref<string | null>(null)
const currentPlanId = ref<string | null>(null)

const selectedPlan = computed(() => plans.value.find(p => p.planId === selectedPlanId.value) || null)
const isSelectingCurrent = computed(() => selectedPlanId.value && selectedPlanId.value === currentPlanId.value)

const primaryCta = computed(() => {
  if (!selectedPlan.value) return 'Continue'
  if (isSelectingCurrent.value) return 'Current plan'
  return selectedPlan.value.tier === 'free' ? 'Switch to Free' : `Upgrade to ${selectedPlan.value.name}`
})

async function loadPage() {
  loading.value = true
  error.value = null
  try {
    const [planList, current] = await Promise.all([
      mockFetchPlans(),
      mockGetCurrentPlan(),
    ])
    plans.value = planList
    currentPlanId.value = current.planId
    selectedPlanId.value = currentPlanId.value || (plans.value[0]?.planId ?? null)
  } catch (e: any) {
    console.error(e)
    error.value = 'Failed to load plans. Please try again.'
  } finally {
    loading.value = false
  }
}

async function proceed() {
  if (!selectedPlan.value || isSelectingCurrent.value) return
  creating.value = true
  error.value = null
  try {
    const { url } = await mockCreateCheckoutSession(selectedPlan.value.planId)
    await router.push(url)
  } catch (e: any) {
    console.error(e)
    error.value = 'Could not start checkout. Please try again.'
  } finally {
    creating.value = false
  }
}

function choose(planId: string) {
  selectedPlanId.value = planId
}

onMounted(loadPage)
</script>

<template>
  <NuxtLayout>
    <section class="max-w-7xl mx-auto px-4 py-12">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-black dark:text-white">Developer Plans</h1>
        <p class="mt-2 text-black/80 dark:text-white/80">
          Pick the plan that matches your goals. Change anytime.
        </p>
      </div>

      <div v-if="loading" class="grid md:grid-cols-3 gap-6">
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
                <strong>{{ selectedPlan.name }}</strong>
                <span class="mx-2">•</span>
                <span>{{ selectedPlan.price }}</span>
              </template>
              <template v-else>
                Select a plan to continue
              </template>
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto">
              <button type="button"
                class="px-5 py-2.5 rounded bg-indigo-600 text-white font-medium shadow hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto"
                :disabled="!selectedPlan || isSelectingCurrent || creating" @click="proceed">
                <span v-if="creating" class="animate-pulse">Processing…</span>
                <span v-else>{{ primaryCta }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Plans grid -->
        <div class="grid md:grid-cols-3 gap-6 items-stretch">
          <div v-for="plan in plans" :key="plan.planId" class="relative group">
            <div class="absolute -inset-0.5 rounded-2xl transition shadow-sm"
              :class="selectedPlanId === plan.planId ? 'ring-2 ring-indigo-500/70 dark:ring-indigo-500' : 'ring-1 ring-black/20 dark:ring-white/50'" />
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
