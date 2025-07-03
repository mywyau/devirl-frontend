<script setup lang="ts">
import Input from '@/components/reka/Input.vue';
import { useAuthUser } from '@/composables/useAuthUser';
import { loadConfig } from '@/configuration/ConfigLoader';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';


function handleAction() {
  // eslint-disable-next-line no-alert
  alert('clicked action button!')
}


const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`


const { data: user } = await useAuthUser()
const safeUserId = computed(() => user.value?.sub)

function roundUpTo2DP(value: number): number {
  return Math.ceil(value * 100) / 100
}

const platformFeePercent = 2.5 // e.g., 2.5%

const fee = computed(() => {
  return rewardAmount.value ? roundUpTo2DP(rewardAmount.value * (platformFeePercent / 100)) : 0
})

const totalToPay = computed(() => {
  return rewardAmount.value ? roundUpTo2DP(rewardAmount.value + fee.value) : 0
})


const route = useRoute();
const questIdFromRoute = route.params.id as string;
const questId = questIdFromRoute

const rewardAmount = ref<number>(0)
const success = ref(false)
const error = ref<string | null>(null)

async function submitReward() {
  if (rewardAmount.value < 0) {
    error.value = 'You cannot enter a negative monetary reward'
    return
  }

  try {

    const rewardCents = Math.round(rewardAmount.value * 100) // convert to cents/pence


    await $fetch(`${baseUrl}reward/create/${encodeURIComponent(safeUserId.value)}`, {
      method: 'POST',
      credentials: "include",
      body: {
        questId: questId,
        rewardValue: rewardCents
      }
    })

    success.value = true
    error.value = null

    // Optionally redirect
    // setTimeout(() => router.push('/client/quests'), 2000)

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

      <p class="mb-6">You can add a monetary reward to the quest, you will also pay a
        fee of <span class="text-green-300">2.5%</span>
      </p>

      <p class="mb-6">You will also have to make a stripe payment fee for handling the payment.</p>

      <p class="mb-6">You cannot change or update the reward once the quest has been
        accepted by a developer.</p>

      <p class="mb-6">Payment will only be made when the quest is in review and you are happy to make payment.</p>


      <div class="mt-6 mb-6">
        <label for="reward" class="block text-base text-white font-semibold mb-2">Reward ($)</label>

        <!-- <input id="reward" type="number" v-model="rewardAmount" min="1" step="0.01" -->
        <!-- class="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-600 text-white" -->
        <!-- placeholder="For example 20.00" /> -->

        <Input id="reward-amount" type="number" v-model="rewardAmount" placeholder="For example 20.00" class="w-1/3" />
        <p v-if="error" class="mt-4 text-red-400">
          {{ error }}
        </p>

      </div>

      <div v-if="rewardAmount > 0" class="mt-4 mb-6 text-base text-zinc-300 space-y-">
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
    </div>
  </NuxtLayout>
</template>
