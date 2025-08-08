<script setup lang="ts">
import Input from '@/components/reka/Input.vue';
import { useAuthUser } from '@/composables/useAuthUser';
import { loadConfig } from '@/configuration/ConfigLoader';
import { AddTimeRewardSchema } from "@/types/schema/AddTimeRewardForm";
import { computed, onMounted, ref, type ComputedRef } from 'vue';
import { useRoute } from 'vue-router';

import { roundUpTo2DP } from "@/service/AddRewardService";
import type { RewardData } from '@/types/schema/RewardSchema';

const route = useRoute();
const questIdFromRoute = route.params.id as string;
const questId = questIdFromRoute

const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`

const { data: user } = await useAuthUser()
const safeUserId = computed(() => user.value?.sub)

const isLoading = ref(false);

const platformFeePercent = 2.5;
const timeRewardAmount = ref(0);

const timeOnlyFee: ComputedRef = computed(() =>
  timeRewardAmount.value
    ? roundUpTo2DP(timeRewardAmount.value * (platformFeePercent / 100))
    : 0
);

const totalToPay: ComputedRef = computed(() => {
  const devReward = timeRewardAmount.value
  const fee = timeOnlyFee.value;
  return devReward ? roundUpTo2DP(devReward + fee) : 0;
});

const editMode = ref(false)

const timeSuccess = ref(false)
const timeError = ref<string | null>(null)

const rewardDataGetResult = ref<RewardData | null>(null);

onMounted(async () => {

  const safeUserId = user.value?.sub || "No user id";
  console.debug(encodeURIComponent(safeUserId));

  try {

    rewardDataGetResult.value = await $fetch(`${baseUrl}reward/${encodeURIComponent(safeUserId)}/${questIdFromRoute}`, {
      method: "GET",
      credentials: "include",
    });

    if (rewardDataGetResult.value) {
      timeRewardAmount.value = Math.round((rewardDataGetResult.value.timeRewardValue || 0) / 100);
      editMode.value = true;
    }


  } catch (e: any) {
    if (e?.response?.status == 400) {  // Handle Bad Request
      // No reward yet – totally fine
      rewardDataGetResult.value = null;
    } else {
      timeError.value = "Failed to retrieve reward data.";
      console.error(e);
    }
  } finally {
    isLoading.value = false;
  }
});

async function submitTimeReward() {

  timeError.value = null;
  timeSuccess.value = false;

  const validation = AddTimeRewardSchema.safeParse({
    timeRewardAmount: timeRewardAmount.value,
  });

  if (!validation.success) {
    for (const issue of validation.error.issues) {
      if (issue.path[0] === "timeRewardAmount") {
        timeError.value = issue.message;
      }
    }
    return;
  }

  try {

    const timeRewardCents = Math.round(timeRewardAmount.value * 100);

    await $fetch(`${baseUrl}reward/create/time/${encodeURIComponent(safeUserId.value)}`, {
      method: "PUT",
      credentials: "include",
      body: {
        questId,
        timeRewardValue: timeRewardCents
      },
    });

    timeSuccess.value = true;
  } catch (e: any) {
    timeError.value = "Failed to save time reward. Please try again.";
    console.error(e);
  }
}

</script>

<template>
  <NuxtLayout>

    <div class="max-w-xl mx-auto py-10 px-6 text-black dark:text-white">

      <div class="mb-6">
        <h1 class="text-3xl font-bold mb-6 dark:text-green-300">Time Reward</h1>

        <p v-if="timeSuccess" class="mt-4 text-green-500 dark:text-green-400 font-semibold">
          ${{ timeRewardAmount.toFixed(2) }} Time Reward Saved!
        </p>

        <div>
          <div class="mt-6 mb-6">

            <p v-if="editMode === true" class="mb-6">Please update the time reward.</p>
            <p v-else class="mb-6">Please add a time reward.</p>

            <label for="time-reward-amount" class="block text-base text-green-500 dark:text-green-400 mb-2">
              Time Reward ($)
            </label>
            <p class="text-sm mb-2 text-zinc-600 dark:text-zinc-400">Hint: You can come back and update the reward
              amount if the quest status is <span class="text-zinc-600 dark:text-zinc-400 font-medium">Not
                Estimated</span> or <span class="text-orange-500 dark:text-orange-400 font-medium">Estimated</span></p>
            <Input id="time-reward-amount" type="number" v-model="timeRewardAmount" placeholder="For example 20.00"
              class="w-1/3" />
            <p v-if="timeError" class="mt-4 text-red-400">{{ timeError }}</p>

          </div>
        </div>

        <div v-if="timeRewardAmount > 0" class="mt-4 mb-6 text-base text-black dark:text-white space-y-2">
          <p><strong>Developer Reward:</strong> ${{ timeRewardAmount.toFixed(2) }}</p>
          <p><strong>Platform Fee ({{ platformFeePercent }}%):</strong> ${{ timeOnlyFee.toFixed(2) }}</p>
          <p class="text-green-500 dark:text-green-300 font-semibold">
            <strong>Total:</strong> ${{ totalToPay.toFixed(2) }}
          </p>
        </div>

        <button v-if="editMode" @click="submitTimeReward"
          class="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded">
          Update Monetary Reward
        </button>
        <button v-else="" @click="submitTimeReward"
          class="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded">
          Add Monetary Reward
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>
