<script setup lang="ts">

import { getQuest, updateQuest } from "@/controllers/QuestBackendController";
import type { QuestPartial, UpdateQuestPayload } from "@/types/quests";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthUser } from "@/composables/useAuthUser";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

// Form data
const questUpdatePayload = ref<UpdateQuestPayload>({
  title: "",
  description: "",
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
  title: "",
  description: "",
});

async function handleUpdateQuest() {
  const currentQuestId = route.params.id as string;
  isSubmitting.value = true;

  try {
    await updateQuest(safeUserId, currentQuestId, {
      title: result.value.title,
      description: result.value.description ?? "",
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
                class="w-full px-4 py-2 rounded bg-white/20 text-white/80 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400">
              </textarea>
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
