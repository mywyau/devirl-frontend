<script setup lang="ts">

import { useAuthUser } from "@/composables/useAuthUser";
import { createQuest } from "@/controllers/QuestBackendController"; // <- updated import
import type { CreateQuestPayload } from "@/types/quests";
import { ref } from "vue";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tier = ref<string | null>(null);
const notes = ref("");

const levelOptions = [
  { value: "Bronze", label: "Bronze" },
  { value: "Iron", label: "Iron" },
  { value: "Steel", label: "Steel" },
  { value: "Mithril", label: "Mithril" },
  { value: "Adamantite", label: "Adamantite" },
  { value: "Runic", label: "Runic" },
  { value: "Ruinous", label: "Ruinous" },
  { value: "Demon", label: "Demon" },
  { value: "Aether", label: "Aether" },
];


// Form data
const questCreatePayload = ref<CreateQuestPayload>(
  {
    tier: "",
    title: "",
    description: "",
    acceptanceCriteria: "",
  }
);

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
      questCreatePayload.value =
      {
        tier: "",
        title: "",
        description: "",
        acceptanceCriteria: "",
      };
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

        <div class="flex flex-col space-y-2">
          <label for="role-select" class="text-sm font-medium text-white">
            Quest Tier
          </label>

          <Select v-model="tier">
            <SelectTrigger id="tier-select"
              class="w-full flex justify-between items-center rounded-lg border border-green-400 bg-white px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400">
              <SelectValue placeholder="Choose difficulty tier" />
            </SelectTrigger>

            <SelectContent class="w-full bg-white rounded-lg border border-zinc-400">
              <SelectLabel class="px-4 py-2 text-xs font-medium text-zinc-500">
                Tiers
              </SelectLabel>
              <SelectItem v-for="opt in levelOptions" :key="opt.value" :value="opt.value"
                class="w-full px-4 py-2 text-black hover:bg-zinc-100">
                {{ opt.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

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
          <textarea id="quest-description" v-model="questCreatePayload.description" rows="5"
            placeholder="What needs to be done? Be as clear and helpful as possible."
            class="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"></textarea>
        </div>

        <div>
          <label for="quest-description" class="block mb-1 text-sm font-medium text-white">
            Acceptance Criteria (required)
          </label>
          <textarea id="quest-description" v-model="questCreatePayload.acceptance" rows="5"
            placeholder="Add some base acceptance criteria to help the dev achieve the goal"
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
