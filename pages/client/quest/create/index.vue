<script setup lang="ts">

import { createQuest } from "@/controllers/QuestBackendController"; // <- updated import
import type { CreateQuestPayload } from "@/types/quests";
import { ref } from "vue";
import { useAuthUser } from "~/composables/useAuthUser";


// Form data
const questCreatePayload = ref<CreateQuestPayload>({
  title: "",
  description: "",
});

const { data: user, error } = useAuthUser();


if (error.value) {
  console.error("Failed to load auth session:", error.value);
}

const isSubmitting = ref(false);
const submissionSuccess = ref(false);
const submissionError = ref<string | null>(null);

// Submission handler
async function handleSubmit() {
  isSubmitting.value = true;
  submissionSuccess.value = false;
  submissionError.value = null;

  const userId = user.value?.sub;
  if (!userId) {
    submissionError.value = "User ID not available.";
    isSubmitting.value = false;
    return;
  }

  try {
    const result = await createQuest(userId, {
      ...questCreatePayload.value,
    });

    if (result) {
      submissionSuccess.value = true;
      questCreatePayload.value = { title: "", description: "" };
    } else {
      submissionError.value = "Submission failed. Please try again.";
    }
  } catch (err) {
    console.error(err);
    submissionError.value = "An unexpected error occurred.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl text-green-300 font-bold mb-6">Create a New Quest</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="quest-title" class="block mb-1 text-sm font-medium text-white">
            Quest Title
          </label>
          <input id="quest-title" v-model="questCreatePayload.title" type="text" required
            placeholder="Write a short, punchy title like 'Fix the broken login page'"
            class="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400" />
          <p class="mt-1 text-sm text-zinc-400">Max 100 characters</p>
        </div>

        <div>
          <label for="quest-description" class="block mb-1 text-sm font-medium text-white">
            Description (optional)
          </label>
          <textarea id="quest-description" v-model="questCreatePayload.description" rows="4"
            placeholder="What needs to be done? Be as clear and helpful as possible."
            class="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"></textarea>
        </div>

        <div>
          <button type="submit" class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded"
            :disabled="isSubmitting">
            Create Quest
          </button>
        </div>

        <p v-if="submissionSuccess" class="text-green-400">
          Quest created successfully!
        </p>
        <p v-if="submissionError" class="text-red-400">{{ submissionError }}</p>
      </form>
    </div>
  </NuxtLayout>
</template>
