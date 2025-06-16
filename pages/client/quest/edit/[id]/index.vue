<script setup lang="ts">

import { getQuest, updateQuest } from "@/controllers/QuestBackendController";
// import type { QuestPartial, UpdateQuestPayload } from "@/types/quests";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthUser } from "@/composables/useAuthUser";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpdateQuestPayload {
  rank: string,
  title: string,
  description: string,
  acceptanceCriteria: string,
}

interface QuestPartial {
  // questId: string,
  // clientId: string,
  // devId: string,
  rank: string,
  title: string,
  description?: string,
  acceptanceCriteria: string,
  status: string,
}

const rankOptions = [
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
const questUpdatePayload = ref<UpdateQuestPayload>({
  rank: "",
  title: "",
  description: "",
  acceptanceCriteria: "",
});

const route = useRoute();
const questId = route.params.id as string;

const success = ref(false);
const showError = ref(false);
const isSubmitting = ref(false);

const { data: user, error: userError } = await useAuthUser();


console.debug(encodeURIComponent(user.value?.sub || "No user id"));
const safeUserId = user.value?.sub || "No user id";

const result = ref<QuestPartial | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  isLoading.value = true;
  try {
    result.value = await getQuest(safeUserId, questId);
    console.debug(`[Edit Quest Page][getQuest]${result.value}`);
  } catch (e) {
    console.error(e);
    error.value = "[Edit Quest Page] Failed to load quest.";
  } finally {
    isLoading.value = false;
  }
});

const updateQuestPayload = ref<UpdateQuestPayload>({
  rank: "",
  title: "",
  description: "",
  acceptanceCriteria: "",
});

async function handleUpdateQuest() {
  const currentQuestId = route.params.id as string;
  isSubmitting.value = true;

  try {
    await updateQuest(safeUserId, currentQuestId, {
      rank: result.value.rank,
      title: result.value.title,
      description: result.value.description ?? "",
      acceptanceCriteria: result.value?.acceptanceCriteria ?? "",
    });
    success.value = true;

    // await new Promise((resolve) => setTimeout(resolve, 750));
    // Redirect or refresh
    // navigateTo("/quests");
  } catch (err) {
    showError.value = true;
    // await new Promise((resolve) => setTimeout(resolve, 750));
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="max-w-3xl mx-auto p-6">
      <Card class="bg-white/5 border-white/10">
        <CardContent class="p-6 space-y-4">
          <div>
            <h1 class="text-3xl text-yellow-200 font-bold">Edit Quest</h1>
            <p class="text-yellow-300/80 text-base pt-4">
              Update the details of your posted quest.
            </p>
          </div>

          <Separator />

          <form v-if="result" @submit.prevent="handleUpdateQuest" class="space-y-4">

            <div class="flex flex-col space-y-2">
              <label for="rank-select" class="text-sm font-medium text-white">
                Quest Tier
              </label>

              <Select v-model="result.rank">
                <SelectTrigger id="rank-select"
                  class="w-full flex justify-between items-center rounded-lg border border-green-400 bg-white px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400">
                  <SelectValue placeholder="Choose rank" />
                </SelectTrigger>

                <SelectContent class="w-full bg-white rounded-lg border border-zinc-400">
                  <SelectLabel class="px-4 py-2 text-xs font-medium text-zinc-500">
                    Tiers
                  </SelectLabel>
                  <SelectItem v-for="opt in rankOptions" :key="opt.value" :value="opt.value"
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
              <input id="quest-title" v-model="result.title" type="text" required
                placeholder="Write a short, punchy title like 'Fix the broken login page'"
                class="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <p class="mt-1 text-sm text-zinc-400">Max 100 characters</p>
            </div>

            <div>
              <label for="quest-description" class="block mb-1 text-sm font-medium text-white">
                Description (optional)
              </label>
              <textarea id="quest-description" v-model="result.description" rows="4"
                placeholder="What needs to be done? Be as clear and helpful as possible."
                class="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400">
              </textarea>
            </div>

            <div>
              <label for="acceptance-criteria" class="block mb-1 text-sm font-medium text-white">
                Acceptance Criteria (required)
              </label>
              <textarea id="acceptance-criteria" v-model="result.acceptanceCriteria" rows="5"
                placeholder="Add some acceptance criteria to help achieve the scope"
                class="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"></textarea>
            </div>

            <div>
              <button type="submit" class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded"
                :disabled="isSubmitting">
                Update Quest
              </button>
            </div>
          </form>

          <p v-if="success" class="text-green-500 text-sm">
            Quest updated successfully!
          </p>

          <p v-if="showError" class="text-red-500 text-sm">
            Quest update unsuccessful!
          </p>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
