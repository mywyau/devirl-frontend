<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()


// 1) Grab the route param
const route = useRoute();
const questIdFromRoute = route.params.id as string;


// Get quest ID from route
const questId = questIdFromRoute
const clientId = 'mock-client-id' // Replace with session/composable logic
const devId = 'mock-dev-id' // You might auto-fill this from quest data

const baseReward = ref<number | null>(null)
const success = ref(false)
const error = ref<string | null>(null)

async function submitReward() {
  if (!baseReward.value || baseReward.value <= 0) {
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
        base_reward: baseReward.value
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

      <div class="mb-6">
        <label for="reward" class="block text-sm text-zinc-300 mb-1">Base Reward (£)</label>
        <input id="reward" type="number" v-model="baseReward" min="1" step="0.01"
          class="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-600 text-white" placeholder="e.g. 20.00" />
      </div>

      <button @click="submitReward" class="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded">
        Save Reward
      </button>

      <p v-if="success" class="mt-4 text-green-400 font-semibold">
        ✅ Reward saved successfully!
      </p>
      <p v-if="error" class="mt-4 text-red-400">
        {{ error }}
      </p>
    </div>
  </NuxtLayout>
</template>
