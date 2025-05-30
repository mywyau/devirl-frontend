<!-- src/pages/ClientCompletedQuests.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Button } from "@/components/ui/button/variants";
import { useAuthUser } from "~/composables/useAuthUser";
import { streamAllQuestsByStatus } from "@/controllers/QuestBackendController";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";

// User session
const { data: user, pending: authPending } = useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

// Quests state
const quests = ref<QuestPartial[]>([]);
const error = ref<string | null>(null);
const loading = ref<boolean>(true);

// Fetch completed quests stream
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

  try {
    for await (const quest of streamAllQuestsByStatus(
      userId,
      "NotStarted",
      1,
      50
    )) {
      quests.value.push(quest);
    }
  } catch (err: any) {
    console.error("[ClientCompletedQuests][fetchCompletedQuests] Error streaming quests:", err);
    error.value = "Failed to fetch in progress quests.";
  } finally {
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
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold mb-4 text-yellow-400">Not Started</h1>
      <p class="text-lg mb-6 text-yellow-300">
        Below are all the quests that are in progress.
      </p>

      <div v-if="loading" class="text-gray-400">Loading Not Started quests...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <div v-if="quests.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="quest in quests"
            :key="quest.questId"
            class="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow flex flex-col justify-between h-full"
          >
            <h3 class="text-xl font-semibold text-indigo-300">{{ quest.title }}</h3>
            <p class="text-gray-300 text-sm mt-2 mb-4">{{ quest.description }}</p>
            <div class="mt-auto flex justify-end">
              <NuxtLink
                :to="`/quest/${quest.questId}`"
                class="inline-block text-sm text-sky-300 hover:text-sky-200 hover:underline"
              >
                <Button variant="default" class="bg-indigo-500 text-white rounded hover:bg-indigo-300">
                  View Details
                </Button>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-400">You have no in progress quests.</div>
      </div>
    </div>
  </NuxtLayout>
</template>