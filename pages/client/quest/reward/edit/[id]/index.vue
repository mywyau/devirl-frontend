<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

function roundUpTo2DP(value: number): number {
  return Math.ceil(value * 100) / 100
}

const platformFeePercent = 2.5 

const fee = computed(() => {
  return rewardAmount.value ? roundUpTo2DP(rewardAmount.value * (platformFeePercent / 100)) : 0
})

const totalToPay = computed(() => {
  return rewardAmount.value ? roundUpTo2DP(rewardAmount.value + fee.value) : 0
})


const router = useRouter()

// 1) Grab the route param
const route = useRoute();
const questIdFromRoute = route.params.id as string;


// Get quest ID from route
const questId = questIdFromRoute
const clientId = 'mock-client-id' // Replace with session/composable logic
const devId = 'mock-dev-id' // You might auto-fill this from quest data

const rewardAmount = ref<number | null>(null)
const success = ref(false)
const error = ref<string | null>(null)

async function submitReward() {
  if (!rewardAmount.value || rewardAmount.value <= 0) {
    error.value = 'Please enter a valid reward amount.'
    return
  }

  try {
    // Mocked POST call
    await $fetch('/api/rewards/add', {
      method: 'POST',
      body: {
        quest_id: questId,
        client_id: clientId,
        dev_id: devId,
        base_reward: rewardAmount.value
      }
    })

    success.value = true
    error.value = null
    // Optionally redirect
    setTimeout(() => router.push('/client/quests'), 2000)
  } catch (e: any) {
    error.value = 'Failed to save reward. Please try again.'
    console.error(e)
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="max-w-xl mx-auto py-10 px-6 text-white">

      <h1 class="text-3xl font-bold mb-6 text-green-300">Add Quest Reward</h1>

      <p>You can add a reward amount to the quest, you will also pay a fee of <span class="text-green-300">2.5%</span>
      </p>

      <div class="mt-6 mb-6">
        <label for="reward" class="block text-base text-zinc-300 mb-1">Reward (£)</label>
        <input id="reward" type="number" v-model="rewardAmount" min="1" step="0.01"
          class="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-600 text-white"
          placeholder="For example 20.00" />
      </div>

      <div v-if="rewardAmount && rewardAmount > 0" class="mt-4 mb-6 text-base text-zinc-300 space-y-">
        <p><strong>Developer Reward:</strong> £{{ rewardAmount.toFixed(2) }}</p>
        <p><strong>Platform Fee ({{ platformFeePercent }}%):</strong> £{{ fee.toFixed(2) }}</p>
        <p class="text-green-300 font-semibold">
          <strong>Total:</strong> £{{ totalToPay.toFixed(2) }}
        </p>
      </div>

      <button @click="submitReward" class="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded">
        Add Reward
      </button>

      <p v-if="success" class="mt-4 text-green-400 font-semibold">
        Reward saved successfully!
      </p>


      <p v-if="error" class="mt-4 text-red-400">
        {{ error }}
      </p>
    </div>
  </NuxtLayout>
</template>
