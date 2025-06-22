<!-- src/pages/ClientNotStartedQuests.vue -->
<script setup lang="ts">
import { Button } from "@/components/ui/button/variants";
import { useAuthUser } from "@/composables/useAuthUser";
import {
  streamAllQuestsByStatusDev,
  updateQuestStatusRequest,
} from "@/controllers/QuestBackendController";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";
import { computed, onMounted, ref, watch } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

// User session
const { data: user, pending: authPending } = useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

// Quests state
const quests = ref<QuestPartial[]>([]);
const error = ref<string | null>(null);
const loading = ref<boolean>(true);

// Fetch not-started quests stream
async function fetchNotStartedQuests() {
  const userId = safeUserId.value;
  if (!userId) {
    error.value = "Not authenticated.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;
  quests.value = [];

  let receivedAny = false;
  try {
    for await (const quest of streamAllQuestsByStatusDev(
      userId,
      "Review",
      1,
      50
    )) {
      if (!receivedAny) {
        loading.value = false;
        receivedAny = true;
      }
      quests.value.push(quest);
    }
    if (!receivedAny) {
      loading.value = false;
    }
  } catch (e: any) {
    console.error("[ClientNotStartedQuests] Error streaming quests:", e);
    error.value = "Failed to fetch quests in review.";
    loading.value = false;
  }
}

// Trigger on mount after auth resolves
onMounted(() => {
  if (authPending.value) {
    const stop = watch(
      authPending,
      (pending) => {
        if (!pending) {
          stop();
          fetchNotStartedQuests();
        }
      },
      { immediate: true }
    );
  } else {
    fetchNotStartedQuests();
  }
});

// 8) (Optional) keep your “accept”/“report” state for future actions
const inReviewSuccess = ref(false);
const inReviewError = ref(false);

// If you need to implement a handler later, you can do:
async function handleUpdateQuestStatus(questId: string) {
  if (!safeUserId.value) {
    inReviewError.value = true;
    return;
  }
  try {
    // On the client, credentials: "include" is enough to send the cookie
    await updateQuestStatusRequest(safeUserId.value, questId, {
      questStatus: "Review",
    });
    inReviewSuccess.value = true;
  } catch (err) {
    inReviewError.value = true;
    console.error(err);
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold mb-4 text-blue-400">Review</h1>
      <p class="text-lg mb-6 text-blue-400/80">
        Below are all the quests that are in review.
      </p>

      <!-- Show quests immediately when available -->
      <div v-if="quests.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="(quest, index) in quests" :key="quest.questId"
          class="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow flex flex-col justify-between h-full">
          <h2 id="quest-title" class="text-xl font-semibold text-blue-300">{{ quest.title }}</h2>
          <p class="text-white text-sm mt-2 mb-4">
            {{ quest.description }}
          </p>

          <NuxtLink :to="`/dev/quest/${quest.questId}`"
            class="text-indigo-300 rounded hover:text-indigo-200 hover:underline text-sm">
            View Details
          </NuxtLink>

          <div class="mt-auto flex justify-end space-x-3">

            <Button variant="default" class="bg-teal-500 text-white rounded hover:bg-teal-400"
              @click="router.push(`/dev/quest/submit/${quest.questId}`)">
              Upload File
            </Button>

          </div>
        </div>
      </div>

      <!-- If still loading and no quests yet -->
      <div v-else-if="loading" class="text-zinc-400">
        Loading Not Started quests...
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-red-500">
        {{ error }}
      </div>

      <div v-else-if="inReviewSuccess" class="text-green-500">
        Successfully moved quest to in review!
      </div>

      <div v-else-if="inReviewError" class="text-red-500">
        Unable to move quest to in review
      </div>

      <!-- No data after loading -->
      <div v-else class="text-zinc-400">You have no quests in review.</div>
    </div>
  </NuxtLayout>
</template>
