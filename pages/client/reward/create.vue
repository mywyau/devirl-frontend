<script setup lang="ts">
import { ref } from "vue";
import { useAuthUser } from "@/composables/useAuthUser";

interface CreateRewardPayload {
  baseReward: "",
  timeReward: "",
  completionReward: "",
  bonus: "",
}

// Form data
const rewardCreatePayload = ref<CreateRewardPayload>({
  baseReward: "",
  timeReward: "",
  completionReward: "",
  bonus: "",
});

const { data: user, userError, refresh } = await useAuthUser();

if (error.value) {
  console.error("Failed to load auth session:", error.value);
}

// Create the controller
// const rewardController = new RewardController();

const isSubmitting = ref(false);
const submissionSuccess = ref(false);
const submissionError = ref<string | null>(null);

// Submission handler
async function handleSubmit() {
  isSubmitting.value = true;
  submissionSuccess.value = false;
  submissionError.value = null;

  console.debug(encodeURIComponent(user.value?.sub || "No user id"));

  try {
    // Use .value to access the reactive data from the ref
    const result = await rewardController.createReward(
      {
        ...rewardCreatePayload.value,
      },
      encodeURIComponent(user.value?.sub || "No user id") || "No user id"
    );

    if (result) {
      submissionSuccess.value = true;
      // Clear the form after submission
      rewardCreatePayload.value = { title: "", description: "" };
    } else {
      submissionError.value = "Submission failed. Please try again.";
    }
  } catch (error) {
    console.error(error);
    submissionError.value = "An unexpected error occurred.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto text-white">
      <h1 class="text-3xl font-bold mb-6">Add a reward</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="pb-4">
          <label
            for="base-reward"
            class="block mb-2 text-sm font-medium text-white"
          >
            Base Reward (£)
          </label>
          <input
            id="quest-reward"
            v-model="rewardCreatePayload.baseReward"
            type="number"
            required
            min="0"
            class="w-1/3 px-4 py-2 rounded bg-white/10 text-white/80 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div class="pb-4">
          <label
            for="time-reward"
            class="block mb-2 text-sm font-medium text-white"
          >
            Time Reward (£)
          </label>
          <input
            id="time-reward"
            v-model="rewardCreatePayload.timeReward"
            type="number"
            required
            min="0"
            class="w-1/3 px-4 py-2 rounded bg-white/10 text-white/80 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div class="pb-4">
          <label
            for="completion-reward"
            class="block mb-2 text-sm font-medium text-white"
          >
            Completion Reward (£)
          </label>
          <input
            id="completion-reward"
            v-model="rewardCreatePayload.completionReward"
            type="number"
            required
            min="0"
            class="w-1/3 px-4 py-2 rounded bg-white/10 text-white/80 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div>
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded"
            :disabled="isSubmitting"
          >
            Create reward
          </button>
        </div>

        <p v-if="submissionSuccess" class="text-green-400">
          Reward created successfully!
        </p>
        <p v-if="submissionError" class="text-red-400">{{ submissionError }}</p>
      </form>
    </div>
  </NuxtLayout>
</template>
