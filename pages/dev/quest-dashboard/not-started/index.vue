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
      "NotStarted",
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
    error.value = "Failed to fetch not started quests.";
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
const inProgressSuccess = ref(false);
const inProgressError = ref(false);

// If you need to implement a handler later, you can do:
async function handleupdateQuestStatus(questId: string) {
  if (!safeUserId.value) {
    inProgressError.value = true;
    return;
  }
  try {
    // On the client, credentials: "include" is enough to send the cookie
    await updateQuestStatusRequest(safeUserId.value, questId, {
      questStatus: "InProgress",
    });
    inProgressSuccess.value = true;
  } catch (err) {
    inProgressError.value = true;
    console.error(err);
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold mb-4 text-zinc-200">Not Started</h1>
      <p class="text-lg mb-6 text-zinc-300/80">
        Below are all the quests that are not started.
      </p>

      <!-- ← New: Feedback messages go here, outside of the quests‐list logic -->
      <div v-if="inProgressSuccess" class="mb-4 p-3 bg-green-600 text-white rounded">
        Successfully moved quest to In Progress!
      </div>
      <div v-else-if="inProgressError" class="mb-4 p-3 bg-red-600 text-white rounded">
        Unable to move quest to In Progress.
      </div>

      <!-- Show quests immediately when available -->
      <div v-if="quests.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="quest in quests" :key="quest.questId"
          class="text-white p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow flex flex-col justify-between h-full">
          <h2 class="text-xl font-semibold text-zinc-400">
            {{ quest.title }}
          </h2>
          <p class="text-white text-sm mt-2 mb-4">
            {{ quest.description }}
          </p>

          <NuxtLink :to="`/dev/quest/${quest.questId}`"
            class="text-indigo-300 rounded hover:text-indigo-200 hover:underline text-sm">
            View Details
          </NuxtLink>


          <div class="mt-auto flex justify-end space-x-3">

            <Button variant="secondary" class="bg-yellow-500 text-white rounded hover:bg-yellow-400"
              :id="`in-progress-${quest.questId}`"
              :data-testid="`in-progress-${quest.questId}`"
              @click="handleupdateQuestStatus(quest.questId)">
              Move quest to In Progress
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

      <!-- <div v-else-if="inProgressSuccess" class="text-green-500">
        Successfully moved quest to in progress!
      </div>

      <div v-else-if="inProgressError" class="text-red-500">
        Unable to move quest to in progress
      </div> -->

      <!-- No data after loading -->
      <div v-else class="text-zinc-400">You have no not started quests.</div>
    </div>
  </NuxtLayout>
</template>
