<script setup lang="ts">
import Input from '@/components/reka/Input.vue';
import RewardAccordion from '@/components/ui/rewards/add/RewardAccordion.vue';
import { useAuthUser } from '@/composables/useAuthUser';
import { loadConfig } from '@/configuration/ConfigLoader';
import { AddCompletionBonusRewardSchema } from "@/types/schema/AddCompletionBonusRewardForm";
import { computed, onMounted, ref, type ComputedRef } from 'vue';
import { useRoute } from 'vue-router';


import { accordionItems, roundUpTo2DP } from "@/service/AddRewardService";
import { type RewardData } from "@/types/schema/RewardSchema";

const route = useRoute();
const questIdFromRoute = route.params.id as string;
const questId = questIdFromRoute

const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`

const { data: user } = await useAuthUser()

const isLoading = ref(false);
const safeUserId = computed(() => user.value?.sub)


const platformFeePercent = 2.5;
const completeBonusRewardAmount = ref(0);

const completeBonusOnlyFee: ComputedRef = computed(() =>
  completeBonusRewardAmount.value
    ? roundUpTo2DP(completeBonusRewardAmount.value * (platformFeePercent / 100))
    : 0
);

const editMode = ref(false)

const totalToPay: ComputedRef = computed(() => {
  const devReward = completeBonusRewardAmount.value
  const fee = completeBonusOnlyFee.value;
  return devReward ? roundUpTo2DP(devReward + fee) : 0;
});

const completeBonusSuccess = ref(false)
const completeBonusError = ref<string | null>(null)

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
      completeBonusRewardAmount.value = Math.round((rewardDataGetResult.value.completionRewardValue || 0) / 100);
      editMode.value = true
    }

  } catch (e) {
    console.error(e);
    completeBonusError.value = "Failed to retrieve completion reward data.";
  } finally {
    isLoading.value = false;
  }
});

async function submitCompletionReward() {

  completeBonusError.value = null;
  completeBonusSuccess.value = false;

  const validation = AddCompletionBonusRewardSchema.safeParse({
    completionRewardAmount: completeBonusRewardAmount.value,
  });

  if (!validation.success) {
    for (const issue of validation.error.issues) {
      if (issue.path[0] === "completionRewardAmount") {
        completeBonusError.value = issue.message;
      }
    }
    return;
  }

  try {

    const completeBonusRewardCents = Math.round(completeBonusRewardAmount.value * 100);

    await $fetch(`${baseUrl}reward/create/complete/bonus/${encodeURIComponent(safeUserId.value)}`, {
      method: "PUT",
      credentials: "include",
      body: {
        questId,
        completionRewardValue: completeBonusRewardCents
      },
    });

    completeBonusSuccess.value = true;
  } catch (e: any) {
    completeBonusError.value = "Failed to save Completion Bonus reward. Please try again.";
    console.error(e);
  }
}

</script>

<template>
  <NuxtLayout>

    <div class="max-w-xl mx-auto py-10 px-6 text-white">

      <div class="mb-6">
        <h1 class="text-3xl font-bold mb-6 text-green-300">Completion Bonus</h1>

        <p v-if="completeBonusSuccess" class="mt-4 text-green-400 font-semibold">
          ${{ totalToPay.toFixed(2) }} Completion Bonus was added successfully!
        </p>

        <div>
          <div class="mt-6 mb-6">
            <p class="mb-6">Please add a reward for a completion bonus.</p>

            <label for="complete-bonus-reward-amount" class="block text-base text-green-400 mb-2">
              Completion Bonus ($)
            </label>
            <p class="text-sm mb-2">Hint: You can come back and update the reward amount if the quest is
              <span class="text-zinc-400 font-medium">Not Estimated</span> or <span
                class="text-orange-400 font-medium">Estimated</span>
            </p>
            <Input id="complete-bonus-reward-amount" type="number" v-model="completeBonusRewardAmount"
              placeholder="For example 20.00" class="w-1/3" />
            <p v-if="completeBonusError" class="mt-4 text-red-400">{{ completeBonusError }}</p>
          </div>
        </div>

        <div v-if="completeBonusRewardAmount > 0" class="mt-4 mb-6 text-base text-zinc-300 space-y-2">
          <p><strong>Developer Reward:</strong> ${{ completeBonusRewardAmount.toFixed(2) }}</p>
          <p><strong>Platform Fee ({{ platformFeePercent }}%):</strong> ${{ completeBonusOnlyFee.toFixed(2) }}</p>
          <p class="text-green-300 font-semibold">
            <strong>Total:</strong> ${{ totalToPay.toFixed(2) }}
          </p>
        </div>

        <button v-if="editMode === true" @click="submitCompletionReward"
          class="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded">
          Update Monetary Reward
        </button>
        <button v-else="" @click="submitCompletionReward"
          class="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded">
          Add Monetary Reward
        </button>
      </div>

      <RewardAccordion :items="accordionItems" />
    </div>


  </NuxtLayout>
</template>
