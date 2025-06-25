<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { loadConfig } from '@/configuration/ConfigLoader';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`

const route = useRoute()
const questIdFromRoute = route.params.id as string

const { data: user } = await useAuthUser()
const safeUserId = computed(() => user.value?.sub)

// const developerStripeId = computed(() => user.value?.stripeId ?? '') // 👈 your backend must populate this

const amountCents = ref(3000)
const error = ref(null)

const redirectToStripeCheckout = async () => {
  error.value = null

  if (!safeUserId.value) {
    error.value = 'Missing user ID or Stripe ID'
    return
  }

  try {
    const result = await $fetch(`${baseUrl}stripe/checkout/${encodeURIComponent(safeUserId.value)}/${questIdFromRoute}`, {
      method: 'POST',
      credentials: 'include',
      body: {
        // developerStripeId: developerStripeId.value || "mikey",
        developerStripeId: "acct_1Rdaw5P6Ctxbgnqx",
        amountCents: amountCents.value,
      },
    })

    if (!result?.url) {
      throw new Error('No Stripe Checkout URL returned')
    }

    window.location.href = result.url
  } catch (err) {
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
          <label class="block text-xl font-medium text-white pb-4">Amount (cents)</label>
          <p class="block text-xl font-medium text-white">$ {{ amountCents }} </p>
        </div>

        <button type="submit"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
          Checkout
        </button>
      </form>

      <!-- <div v-if="response" class="mt-6 bg-green-100 border border-green-400 text-green-800 rounded p-4">
                <p class="font-semibold">Stripe client secret:</p>
                <pre class="mt-2 break-all text-sm">{{ response.clientSecret }}</pre>
            </div> -->

      <div v-if="error" class="mt-6 bg-red-100 border border-red-400 text-red-800 rounded p-4">
        <p class="font-semibold">Error:</p>
        <p class="mt-1">{{ error }}</p>
      </div>
    </div>
  </NuxtLayout>
</template>
