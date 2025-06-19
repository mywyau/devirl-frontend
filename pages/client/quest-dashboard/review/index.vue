<!-- src/pages/ClientSubmittedQuests.vue -->
<script setup lang="ts">
import { Button } from "@/components/ui/button/variants";
import { useAuthUser } from "@/composables/useAuthUser";
import {
  streamAllQuestsByStatus,
  updateQuestStatusRequest,
  completeQuestRequest,
} from "@/controllers/QuestBackendController";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";
import { computed, onMounted, ref, watch } from "vue";

// User session
const { data: user, pending: authPending } = useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

// Quests state
const quests = ref<QuestPartial[]>([]);
const error = ref<string | null>(null);
const loading = ref<boolean>(true);

// Fetch not-started quests stream
async function fetchAllQuestsInReview() {
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
    for await (const quest of streamAllQuestsByStatus(
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
    error.value = "Failed to fetch submitted quests.";
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
          fetchAllQuestsInReview();
        }
      },
      { immediate: true }
    );
  } else {
    fetchAllQuestsInReview();
  }
});

const completedSuccess = ref(false);
const completedError = ref(false);

// Update Status of Quest
async function handleUpdateQuestToCompleted(questId: string, rank: string) {
  if (!safeUserId.value) {
    completedError.value = true;
    return;
  }
  try {
    // On the client, credentials: "include" is enough to send the cookie
    await completeQuestRequest(safeUserId.value, questId, {
      rank: rank,
      questStatus: "Completed",
    });
    completedSuccess.value = true;
  } catch (err) {
    completedError.value = true;
    console.error(err);
  }
}

const failedSuccess = ref(false);
const failedError = ref(false);

// Update Status of Quest
async function handleUpdateQuestToFailed(questId: string) {
  if (!safeUserId.value) {
    failedError.value = true;
    return;
  }
  try {
    // On the client, credentials: "include" is enough to send the cookie
    await updateQuestStatusRequest(safeUserId.value, questId, {
      questStatus: "Failed",
    });
    failedSuccess.value = true;
  } catch (err) {
    failedError.value = true;
    console.error(err);
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold mb-4 text-blue-400">Review</h1>
      <p class="text-lg mb-6 text-blue-300">
        Below are all the quests in review.
      </p>

      <!-- ← New: Feedback messages go here, outside of the quests‐list logic -->
      <div v-if="completedSuccess" class="mb-4 p-3 bg-green-600 text-white rounded">
        Successfully moved quest to Completed!
      </div>
      <div v-else-if="completedError" class="mb-4 p-3 bg-red-600 text-white rounded">
        Unable to move quest to Completed.
      </div>

      <div v-if="failedSuccess" class="mb-4 p-3 bg-green-600 text-white rounded">
        Successfully moved quest to Failed!
      </div>
      <div v-else-if="failedError" class="mb-4 p-3 bg-red-600 text-white rounded">
        Unable to move quest to Failed.
      </div>

      <!-- Show quests immediately when available -->
      <div v-if="quests.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="quest in quests" :key="quest.questId"
          class="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow flex flex-col justify-between h-full">
          <h2 class="text-xl font-semibold text-blue-300">{{ quest.title }}</h2>

          <p class="text-white text-sm mt-2 mb-4">
            {{ quest.description }}
          </p>

          <NuxtLink :to="`/client/quest/${quest.questId}`"
            class="text-indigo-300 rounded hover:text-indigo-200 hover:underline text-sm">
            View Details
          </NuxtLink>

          <div class="mt-auto flex flex-nowrap justify-end gap-3 overflow-auto">

            <Button variant="secondary" class="bg-green-500 text-white rounded hover:bg-green-400 px-4 py-2 text-sm"
              @click="handleUpdateQuestToCompleted(quest.questId, quest.rank)">
              Complete Quest
            </Button>

            <Button variant="secondary" class="bg-red-500 text-white rounded hover:bg-red-400 px-4 py-2 text-sm"
              @click="handleUpdateQuestToFailed(quest.questId)">
              Fail Quest
            </Button>
          </div>
        </div>
      </div>

      <!-- If still loading and no quests yet -->
      <div v-else-if="loading" class="text-zinc-400">
        Loading quests in review...
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-red-500">
        {{ error }}
      </div>

      <!-- No data after loading -->
      <div v-else class="text-zinc-400">You have no quests in review.</div>
    </div>
  </NuxtLayout>
</template>
