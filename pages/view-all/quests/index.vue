<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthUser } from "~/composables/useAuthUser";
import { streamAllQuests } from "@/controllers/QuestBackendController";
import type { QuestPartial } from "@/types/quests";

const quests = ref<QuestPartial[]>([]);
const error = ref<string | null>(null);
const loading = ref(true);

// Get the user session
const { data: user, pending: authPending } = useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

onMounted(async () => {
  if (authPending.value) {
    // Wait for auth to finish before proceeding
    const stop = watch(
      authPending,
      (pending) => {
        if (!pending) {
          stop(); // Stop watching once resolved
          fetchQuests();
        }
      },
      { immediate: true }
    );
  } else {
    fetchQuests();
  }
});

async function fetchQuests() {
  if (!safeUserId.value) {
    error.value = "Not authenticated.";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;
  quests.value = [];

  try {
    for await (const quest of streamAllQuests(safeUserId.value)) {
      quests.value.push(quest);
    }
  } catch (err) {
    console.error(err);
    error.value = "Failed to fetch quests.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-white">All Available Quests</h1>

      <div v-if="authPending || loading" class="text-gray-500">
        Loading quests...
      </div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else-if="quests.length === 0" class="text-gray-400">
        No quests available yet.
      </div>

      <div class="grid gap-6" v-else>
        <div
          v-for="quest in quests"
          :key="quest.questId"
          class="border p-4 rounded-xl shadow bg-white/5 text-white"
        >
          <h2 class="text-xl font-semibold">{{ quest.title }}</h2>
          <div class="mt-2 text-sm text-yellow-400">
            Status: {{ quest.status }}
          </div>
          <div class="mt-4 flex justify-between items-center">
            <span class="font-mono text-sm text-green-400"
              >💰 {{ quest.bounty || 0.0 }} ETH</span
            >
            <NuxtLink
              :to="`/quest/${quest.questId}`"
              class="text-white hover:underline hover:text-cyan-400"
            >
              View Quest →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
