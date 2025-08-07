<script setup lang="ts">

import Input from '@/components/reka/Input.vue';
import { useAuthUser } from '@/composables/useAuthUser';
import { loadConfig } from '@/configuration/ConfigLoader';
import { WorkHoursSchema, type HoursOfWork } from "@/types/schema/WorkHoursSchema";
import { computed, onMounted, ref, type ComputedRef } from 'vue';
import { useRoute } from 'vue-router';

import { roundUpTo2DP } from "@/service/AddRewardService";

const route = useRoute();
const questIdFromRoute = route.params.id as string;

const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`

const { data: user } = await useAuthUser()
const safeUserId = computed(() => user.value?.sub)

const isLoading = ref(false);

const hoursOfWorkAmount = ref(0);

const totalWorkHours: ComputedRef = computed(() => {
  const devReward = hoursOfWorkAmount.value
  return devReward ? roundUpTo2DP(devReward) : 0;
});

const editMode = ref(false)

const hoursOfWorkSuccess = ref(false)
const hoursOfWorkError = ref<string | null>(null)

const hoursOfWorkGetResult = ref<HoursOfWork | null>(null);

onMounted(async () => {

  const safeUserId = user.value?.sub || "No user id";
  console.debug(encodeURIComponent(safeUserId));

  try {

    hoursOfWorkGetResult.value = await $fetch(`${baseUrl}quest/hours-of-work/${encodeURIComponent(safeUserId)}/${questIdFromRoute}`, {
      method: "GET",
      credentials: "include",
    });

    if (hoursOfWorkGetResult.value) {
      hoursOfWorkAmount.value = Math.round(hoursOfWorkGetResult.value.hoursOfWork || 0);
      editMode.value = true;
    }


  } catch (e: any) {
    if (e?.response?.status == 400) {  // Handle Bad Request
      hoursOfWorkGetResult.value = null;
    } else {
      // hoursOfWorkError.value = "Failed to retrieve the hours of work data.";
      console.error(e);
    }
  } finally {
    isLoading.value = false;
  }
});

async function submitWorkHours() {

  hoursOfWorkError.value = null;
  hoursOfWorkSuccess.value = false;

  const validation = WorkHoursSchema.safeParse({
    hoursOfWork: hoursOfWorkAmount.value,
  });

  if (!validation.success) {
    for (const issue of validation.error.issues) {
      if (issue.path[0] === "hoursOfWork") {
        hoursOfWorkError.value = issue.message;
      }
    }
    return;
  }

  try {

    const numberOfHoursOfWork = Math.round(hoursOfWorkAmount.value);

    await $fetch(`${baseUrl}quest/upsert/hours-of-work/${encodeURIComponent(safeUserId.value)}/${questIdFromRoute}`, {
      method: "PUT",
      credentials: "include",
      body: {
        hoursOfWork: numberOfHoursOfWork
      },
    });

    hoursOfWorkSuccess.value = true;
  } catch (e: any) {
    // hoursOfWorkError.value = "Failed to save hours of work. Please try again.";
    console.error(e);
  }
}

</script>

<template>
  <NuxtLayout>

    <div class="max-w-xl mx-auto py-10 px-6 text-black dark:text-white">

      <div class="mb-6">
        <h1 class="text-3xl font-bold mb-6 text-black dark:text-green-300 ">Work Hours</h1>

        <p v-if="hoursOfWorkSuccess" class="mt-4 text-green-400 font-semibold">
          {{ totalWorkHours.toFixed(2) }} hours of work Saved!
        </p>

        <div>
          <div class="mt-6 mb-6">

            <p v-if="editMode" class="mb-6">Please update the expected number of hours the developer will work.</p>
            <p v-else class="mb-6">Please add an expected number of hours the developer will work.</p>

            <label for="time-reward-amount" class="block text-base text-green-500 dark:text-green-400 mb-2">Number of expected work hours</label>

            <p class="text-sm text-zinc-600 dark:text-zinc-300 mb-2">Hint: You can come back and change the expected number of working hours if the quest status is 
              <span class="text-zinc-400 font-medium">Not Estimated</span>
            </p>

            <Input id="time-reward-amount" type="number" v-model="hoursOfWorkAmount" placeholder="For example 37.5"
              class="w-1/3" />
            <p v-if="hoursOfWorkError" class="mt-4 text-red-400">{{ hoursOfWorkError }}</p>

          </div>
        </div>

        <div v-if="hoursOfWorkAmount > 0" class="mt-4 mb-6 text-base text-white space-y-2">
          <p class="text-base font-semibold">Approx Number of Working Days: <span class="text-green-300 font-sans">{{
            (hoursOfWorkAmount / 7.5).toFixed(2) }} days</span></p>
          <p class="text-sm text-zinc-300">Calculated using <span class="text-green-300 font-sans">7.5 hours</span> per
            work day.</p>
        </div>

        <div v-if="hoursOfWorkAmount > 0" class="mt-4 mb-6 text-base text-zinc-300 space-y-2">
          <p class="text-base font-semibold">Approx Number of Weeks: <span class="text-green-300 font-sans">{{
            (hoursOfWorkAmount / (7.5 * 5)).toFixed(2) }} weeks</span></p>
          <p class="text-sm text-zinc-300">Calculated using <span class="text-green-300 font-sans">37.5 hours</span> per
            week.</p>
        </div>

        <div v-if="hoursOfWorkAmount > 0" class="mt-4 mb-6 text-base text-zinc-300 space-y-2">
          <p class="text-base font-semibold">Approx Number of Months: <span class="text-green-300 font-sans">{{
            (hoursOfWorkAmount / (7.5 * 5 * 4)).toFixed(2) }} months</span></p>
          <p class="text-sm text-zinc-300">Calculated using <span class="text-green-300 font-sans">4 weeks</span> per
            month.</p>
        </div>

        <button v-if="editMode" @click="submitWorkHours"
          class="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded">
          Update Hours of Work
        </button>
        <button v-else="" @click="submitWorkHours" class="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded">
          Add Hours of Work
        </button>
      </div>

      <!-- <RewardAccordion :items="accordionItems" /> -->
    </div>


  </NuxtLayout>
</template>
