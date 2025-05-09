<script setup lang="ts">
import { QuestBackendController } from "@/controllers/QuestBackendController";
import type { CreateQuestPayload } from "@/types/quests";
import { ref } from "vue";

// Form data
const questCreatePayload = ref<CreateQuestPayload>({
  title: "",
  description: ""
});

// Create the controller
const questController = new QuestBackendController();

const isSubmitting = ref(false);
const submissionSuccess = ref(false);
const submissionError = ref<string | null>(null);

// Submission handler
async function handleSubmit() {

  isSubmitting.value = true;
  submissionSuccess.value = false;
  submissionError.value = null;

  try {
    // Only send link and comment to backend
    const result = await questController.createQuestSubmission({
      ...questCreatePayload
    });

    if (result) {
      submissionSuccess.value = true;
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
      <h1 class="text-3xl font-bold mb-6">Create a New Quest</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label
            for="quest-title"
            class="block mb-1 text-sm font-medium text-white"
          >
            Quest Title
          </label>
          <input
            id="quest-title"
            v-model="questCreatePayload.title"
            type="text"
            required
            placeholder="Write a short, punchy title like 'Fix the broken login page'"
            class="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <p class="mt-1 text-sm text-gray-400">
            Max 100 characters
          </p>
        </div>

        <div>
          <label
            for="quest-description"
            class="block mb-1 text-sm font-medium text-white"
          >
            Detailed Instructions (optional)
          </label>
          <textarea
            id="quest-description"
            v-model="questCreatePayload.description"
            rows="4"
            placeholder="What needs to be done? Be as clear and helpful as possible."
            class="w-full px-4 py-2 rounded bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded"
          >
            Create Quest
          </button>
        </div>

        <p v-if="submissionSuccess" class="text-green-400">Quest created successfully!</p>
        <p v-if="submissionError" class="text-red-400">{{ submissionError }}</p>
      </form>
    </div>
  </NuxtLayout>
</template>
