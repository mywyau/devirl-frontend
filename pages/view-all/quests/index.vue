<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useAuthUser } from "~/composables/useAuthUser";
import { streamAllQuests } from "@/controllers/QuestBackendController";
import type { QuestPartial } from "@/types/quests";

const quests = ref<QuestPartial[]>([]);
const error = ref<string | null>(null);
const loading = ref(true);

// Step 1: safely get the session
const { data: user, pending: authPending, error: authError } = useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

console.log(safeUserId.value);

// Step 2: defer data loading until session is ready and user is available
watchEffect(async () => {
  if (authPending.value) return;

  console.log("[watchEffect] user.value:", user.value);
  console.log("[watchEffect] safeUserId:", safeUserId.value);

  console.log("Auth pending done. User:", user.value);

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
    error.value = "Failed to fetch quests.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
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
              class="text-blue-400 hover:underline"
            >
              View Quest →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
