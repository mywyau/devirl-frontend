<script setup lang="ts">
import { streamAllQuests } from "@/controllers/QuestBackendController";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";
import { computed, onMounted, ref } from "vue";
import { useAuthUser } from "~/composables/useAuthUser";

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
      <h1 class="text-3xl font-bold mb-6 text-pink-300">
        All Available Open Quests
      </h1>

      <div v-if="authPending || loading" class="text-zinc-500">
        Loading quests...
      </div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else-if="quests.length === 0" class="text-zinc-400">
        No quests available yet.
      </div>

      <div class="grid gap-6" v-else>
        <div v-for="quest in quests" :key="quest.questId" class="p-4 rounded-xl shadow bg-white/10">
          <h2 class="text-xl font-semibold text-indigo-300">{{ quest.title }}</h2>
          <div class="text-sm text-teal-400 font-semibold mt-2">
            {{ quest.status }}
          </div>
          <div class="mt-4 flex items-center">
            <span class="font-mono text-sm text-green-400">💰 £{{ quest.bounty || 0.0 }}</span>

            <div class="flex space-x-4 ml-auto">
              <NuxtLink :to="`/quest/estimation/${quest.questId}`"
                class="text-white hover:underline hover:text-teal-300">
                Estimations
              </NuxtLink>
              <NuxtLink :to="`/quest/${quest.questId}`" class="text-white hover:underline hover:text-teal-300">
                Details
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
