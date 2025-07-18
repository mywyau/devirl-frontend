<script setup lang="ts">
import Input from '@/components/reka/Input.vue';
import RewardAccordion from '@/components/ui/rewards/add/RewardAccordion.vue';
import { useAuthUser } from '@/composables/useAuthUser';
import { loadConfig } from '@/configuration/ConfigLoader';
import { addRewardSchema } from "@/types/schema/AddRewardForm";
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { accordionItems, useQuestFeeCalculations } from "@/service/AddRewardService";

const route = useRoute();
const questIdFromRoute = route.params.id as string;
const questId = questIdFromRoute

const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`

const { data: user } = await useAuthUser()
const safeUserId = computed(() => user.value?.sub)

const platformFeePercent = 2.5;
const timeRewardAmount = ref(0);
const completionRewardAmount = ref(0);

const {
  timeOnlyFee,
  completionOnlyFee,
  timeAndCompletionFee,
  totalToPay,
} = useQuestFeeCalculations(timeRewardAmount, completionRewardAmount, platformFeePercent);

const completionSuccess = ref(false)
const completionError = ref<string | null>(null)

// const timeRewardAmount = ref<number>(0)
const timeSuccess = ref(false)
const timeError = ref<string | null>(null)

async function submitCompletionReward() {
  timeError.value = null;
  completionError.value = null;
  timeSuccess.value = false;
  completionSuccess.value = false;

  const validation = addRewardSchema.safeParse({
    timeRewardAmount: timeRewardAmount.value,
    completionRewardAmount: completionRewardAmount.value,
  });

  if (!validation.success) {
    for (const issue of validation.error.issues) {
      if (issue.path[0] === "timeRewardAmount") {
        timeError.value = issue.message;
      }
      if (issue.path[0] === "completionRewardAmount") {
        completionError.value = issue.message;
      }
    }
    return;
  }

  try {
    const timeRewardCents = Math.round(timeRewardAmount.value * 100);
    const completionRewardCents = Math.round(completionRewardAmount.value * 100);

    await $fetch(`${baseUrl}reward/create/${encodeURIComponent(safeUserId.value)}`, {
      method: "POST",
      credentials: "include",
      body: {
        questId,
        timeRewardValue: timeRewardCents,
        completionRewardValue: completionRewardCents,
      },
    });

    timeSuccess.value = true;
    completionSuccess.value = true;
  } catch (e: any) {
    timeError.value = "Failed to save time reward. Please try again.";
    completionError.value = "Failed to save completion reward. Please try again.";
    console.error(e);
  }
}


</script>

<template>
  <NuxtLayout>

    <div class="max-w-xl mx-auto py-10 px-6 text-white">

      <div class="mb-6">
        <h1 class="text-3xl font-bold mb-6 text-green-300">Add Quest Reward</h1>

        <p v-if="completionSuccess && timeSuccess" class="mt-4 text-green-400 font-semibold">
          All Rewards Saved Successfully!
        </p>

        <p v-else-if="completionSuccess" class="mt-4 text-green-400 font-semibold">
          Completion Reward Saved Successfully!
        </p>

        <p v-else-if="timeSuccess" class="mt-4 text-green-400 font-semibold">
          Time Reward Saved Successfully!
        </p>

        <div>
          <div class="mt-6 mb-6">
            <p class="mb-6">Please add a quest reward for the time worked on the quest.</p>

            <label for="time-reward-amount" class="block text-base text-green-400 font-semibold mb-2">Time Reward
              ($)</label>
            <Input id="time-reward-amount" type="number" v-model="timeRewardAmount" placeholder="For example 20.00"
              class="w-1/3" />
            <p v-if="timeError" class="mt-4 text-red-400">{{ timeError }}</p>
          </div>
        </div>

        <div>
          <div class="mt-6 mb-6">
            <p class="mt-4 mb-6">Please add a quest reward for completing the quest.</p>

            <label for="completion-reward-amount"
              class="block text-base text-green-400 font-semibold mt-2 mb-2">Completion Reward
              ($)</label>
            <Input id="completion-reward-amount" type="number" v-model="completionRewardAmount"
              placeholder="For example 20.00" class="w-1/3" />
            <p v-if="completionError" class="mt-4 text-red-400">{{ completionError }}</p>
          </div>

          <!-- Combined reward summary -->
          <div v-if="completionRewardAmount > 0 && timeRewardAmount > 0"
            class="mt-4 mb-6 text-base text-zinc-300 space-y-2">
            <p><strong>Developer Reward:</strong> ${{ (completionRewardAmount + timeRewardAmount).toFixed(2) }}</p>
            <p><strong>Platform Fee ({{ platformFeePercent }}%):</strong> ${{ timeAndCompletionFee.toFixed(2) }}</p>
            <p class="text-green-300 font-semibold">
              <strong>Total:</strong> ${{ totalToPay.toFixed(2) }}
            </p>
          </div>

          <!-- Completion-only reward summary -->
          <div v-else-if="completionRewardAmount > 0" class="mt-4 mb-6 text-base text-zinc-300 space-y-2">
            <p><strong>Developer Reward:</strong> ${{ completionRewardAmount.toFixed(2) }}</p>
            <p><strong>Platform Fee ({{ platformFeePercent }}%):</strong> ${{ completionOnlyFee.toFixed(2) }}</p>
            <p class="text-green-300 font-semibold">
              <strong>Total:</strong> ${{ totalToPay.toFixed(2) }}
            </p>
          </div>

          <!-- Time-only reward summary -->
          <div v-else-if="timeRewardAmount > 0" class="mt-4 mb-6 text-base text-zinc-300 space-y-2">
            <p><strong>Developer Reward:</strong> ${{ timeRewardAmount.toFixed(2) }}</p>
            <p><strong>Platform Fee ({{ platformFeePercent }}%):</strong> ${{ timeOnlyFee.toFixed(2) }}</p>
            <p class="text-green-300 font-semibold">
              <strong>Total:</strong> ${{ totalToPay.toFixed(2) }}
            </p>
          </div>

          <button @click="submitCompletionReward"
            class="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded">
            Add Completion Reward
          </button>
        </div>
      </div>

      <RewardAccordion :items="accordionItems"  />

    </div>
  </NuxtLayout>
</template>
