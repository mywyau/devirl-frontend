<!-- src/pages/ClientFailedQuests.vue -->
<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { streamAllQuestsByStatus } from "@/controllers/QuestBackendController";
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
async function fetchFailedQuests() {
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
      "Failed",
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
    console.error("[ClientFailedQuests] Error streaming quests:", e);
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
          fetchFailedQuests();
        }
      },
      { immediate: true }
    );
  } else {
    fetchFailedQuests();
  }
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold mb-4 text-red-400">Failed</h1>
      <p class="text-lg mb-6 text-red-300">
        Below are all the quests that are failed.
      </p>

      <!-- Show quests immediately when available -->
      <div v-if="quests.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="quest in quests"
          :key="quest.questId"
          class="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow flex flex-col justify-between h-full"
        >
          <h2 class="text-xl font-semibold text-red-300">{{ quest.title }}</h2>
          <p class="text-white text-sm mt-2 mb-4">
            {{ quest.description }}
          </p>

          <NuxtLink
            :to="`/client/quest/${quest.questId}`"
            class="text-indigo-300 rounded hover:text-indigo-200 hover:underline text-sm"
          >
            View Details
          </NuxtLink>
        </div>
      </div>

      <!-- If still loading and no quests yet -->
      <div v-else-if="loading" class="text-zinc-400">
        Loading Failed quests...
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-red-500">
        {{ error }}
      </div>

      <!-- No data after loading -->
      <div v-else class="text-zinc-400">You have no failed quests.</div>
    </div>
  </NuxtLayout>
</template>
