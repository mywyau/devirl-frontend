<!-- src/pages/ClientCompletedQuests.vue -->
<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { streamAllQuestsByStatusDev } from "@/controllers/QuestBackendController";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

function goToRewards() {
  router.push('/dev/rewards/claim');
}

// User session
const { data: user, pending: authPending } = useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

// Quests state
const quests = ref<QuestPartial[]>([]);
const error = ref<string | null>(null);
const loading = ref<boolean>(true);

// Fetch not-started quests stream
async function fetchCompletedQuests() {
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
      "Completed",
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
    console.error("[ClientCompletedQuests] Error streaming quests:", e);
    error.value = "Failed to fetch completed quests.";
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
          fetchCompletedQuests();
        }
      },
      { immediate: true }
    );
  } else {
    fetchCompletedQuests();
  }
});
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold mb-4 text-green-300">Completed</h1>
      <p class="text-lg mb-6 text-green-400/80">
        Below are all the quests that are completed.
      </p>

      <!-- Show quests immediately when available -->
      <div v-if="quests.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="quest in quests" :key="quest.questId"
          class="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow flex flex-col justify-between h-full">
          <h2 id="quest-title" class="text-xl font-semibold text-green-300">
            {{ quest.title }}
          </h2>

          <div class="mt-auto flex justify-between items-center pt-4 ">
            <!-- <button @click="goToRewards"
              class="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded transition-colors">
              Claim Reward
            </button> -->


          <NuxtLink :to="`/dev/quest/${quest.questId}`"
            class="text-indigo-300 rounded hover:text-indigo-200 hover:underline text-sm">
            View Details
          </NuxtLink>
          </div>

        </div>
      </div>

      <!-- If still loading and no quests yet -->
      <div v-else-if="loading" class="text-zinc-400">
        Loading Completed quests...
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-red-500">
        {{ error }}
      </div>

      <!-- No data after loading -->
      <div v-else class="text-zinc-400">You have no completed quests.</div>
    </div>
  </NuxtLayout>
</template>
