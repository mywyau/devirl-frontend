<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { streamAllQuests } from "@/controllers/QuestBackendController";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";
import { useCookie } from "nuxt/app";
import { computed, onMounted, ref, watch } from "vue";

const userType = useCookie("user_type"); // reads cookie on client and SSR

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
        <div v-for="(quest, index) in quests" :key="quest.questId" class="p-4 rounded-xl shadow bg-white/10">

          <h2 :id="`quest-title-${index}`" class="text-xl font-semibold text-indigo-300">
            {{ quest.title }}
          </h2>
          
          <div class="flex justify-between items-center mb-1">
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-for="tag in quest.tags" :key="tag" class="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {{ tag }}
              </span>
            </div>
            <span class="text-base text-zinc-400">{{ quest.rank }}</span>
          </div>


          <div class="flex justify-between items-center mb-1">
            <span class="text-sm text-teal-400 font-semibold mt-2">{{ quest.status }}</span>
          </div>

          <div class="mt-4 flex items-center">

            <span class="font-mono text-sm text-green-400">💰 £{{ quest.bounty || 0.0 }}</span>

            <div class="flex space-x-4 ml-auto">
              <NuxtLink v-if="userType == 'Dev'" :to="`/quest/estimation/${quest.questId}`"
                :id="`estimation-link-${quest.questId}`" :data-testid="`estimation-link-${quest.questId}`"
                class="text-white hover:underline hover:text-teal-300">
                Estimations
              </NuxtLink>
              <NuxtLink :to="`/quest/${quest.questId}`" :id="`details-link-${quest.questId}`"
                :data-testid="`details-link-${quest.questId}`" class="text-white hover:underline hover:text-teal-300">
                Details
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
