<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Reward {
  questId: string
  title: string
  payout: number
  xp: number
  loot?: string[]
  claimed: boolean
}

const reward = ref<Reward>({
  questId: 'q1',
  title: 'Fix Broken Navbar',
  payout: 5,
  xp: 250,
  claimed: false
})

function claimReward(questId: string) {
  if (reward) {
    reward.value.claimed = true
    // In real app: await $fetch(`/api/rewards/claim`, { method: 'POST', body: { questId } })
    router.push('/dev/rewards/loot')
  }
}
</script>


<template>
  <NuxtLayout>
    <div class="max-w-3xl mx-auto py-10 px-6 text-white">
      <h1 class="text-3xl font-bold mb-6 text-center text-white">Claim Your Rewards</h1>

      <div class="space-y-6">
        <div :key="reward.questId" class="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-lg font-semibold text-white">{{ reward.title }}</h2>
              <p class="text-sm text-green-400 mt-1">💰 £{{ reward.payout }}</p>
              <p class="text-sm text-green-400">+{{ reward.xp }} XP</p>
              <p v-if="reward.loot?.length" class="text-sm text-yellow-300 mt-1">
                Loot: {{ reward.loot.join(', ') }}
              </p>
            </div>

            <div>
              <button v-if="!reward.claimed" to="/dev/rewards/loot"
                class="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded"
                @click="claimReward(reward.questId)">
                Open Chest
              </button>
              <span v-else class="text-green-400 font-semibold text-sm">Claimed</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
