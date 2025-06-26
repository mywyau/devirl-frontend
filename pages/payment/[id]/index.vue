<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { loadConfig } from '@/configuration/ConfigLoader';
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`

const route = useRoute()
const questIdFromRoute = route.params.id as string

const { data: user } = await useAuthUser()
const safeUserId = computed(() => user.value?.sub)

const paymentAmount = ref(0)
const feeMultiplier = 1.025
const amountCents = computed(() => Math.ceil(paymentAmount.value * feeMultiplier))
const amountDollars = computed(() => (amountCents.value / 100).toFixed(2))
const error = ref<string | null>(null)
const success = ref(false)

onMounted(async () => {
  try {
    const result = await $fetch<{rewardValue: number}>(`${baseUrl}reward/${encodeURIComponent(safeUserId.value!)}/${questIdFromRoute}`, {
      method: 'GET',
      credentials: "include"
    })

    paymentAmount.value = result.rewardValue 
    success.value = true
    error.value = null
  } catch (e: any) {
    error.value = 'Failed to load reward. Please try again.'
    console.error(e)
  }
})

const redirectToStripeCheckout = async () => {
  error.value = null

  if (!safeUserId.value) {
    error.value = 'Missing user ID or Stripe ID'
    return
  }

  try {
    const result = await $fetch<{ url: string }>(`${baseUrl}stripe/checkout/${encodeURIComponent(safeUserId.value)}/${questIdFromRoute}`, {
      method: 'POST',
      credentials: 'include',
      body: {
        developerStripeId: "acct_1Rdaw5P6Ctxbgnqx",
        amountCents: amountCents.value,
      },
    })

    if (!result?.url) {
      throw new Error('No Stripe Checkout URL returned')
    }

    window.location.href = result.url
  } catch (err: any) {
    console.error('Checkout error:', err)
    error.value = err?.message || 'Unexpected error during Stripe checkout'
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="max-w-xl mx-auto p-8">
      <h1 class="text-white text-3xl font-bold mb-6">Payment</h1>

      <form @submit.prevent="redirectToStripeCheckout" class="space-y-6">
        <div>
          <p class="block text-xl font-medium text-white">$ {{ amountDollars  }} </p>
        </div>

        <button type="submit"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
          Checkout
        </button>
      </form>

      <div v-if="error" class="mt-6 bg-red-100 border border-red-400 text-red-800 rounded p-4">
        <p class="font-semibold">Error:</p>
        <p class="mt-1">{{ error }}</p>
      </div>
    </div>
  </NuxtLayout>
</template>
