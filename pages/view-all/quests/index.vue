<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { streamAllQuestsReward } from "@/controllers/QuestController";
import type { QuestWithReward } from "@/types/schema/QuestStatusSchema";
import { getStatusTextColour } from "@/utils/QuestStatusUtils";
import { useCookie } from "nuxt/app";
import { computed, onMounted, ref, watch } from "vue";


const userType = useCookie("user_type"); // reads cookie on client and SSR

const questsWithReward = ref<QuestWithReward[]>([]);
const error = ref<string | null>(null);
const loading = ref(true);

function rankClass(rank: string): string {
  switch (rank.toLowerCase()) {
    case "bronze":
      return "text-yellow-400";
    case "iron":
      return "text-gray-400";
    case "steel":
      return "text-gray-300";
    case "mithril":
      return "text-blue-300";
    case "adamantite":
      return "text-green-300";
    case "runic":
      return "text-teal-300";
    case "demon":
      return "text-red-400";
    case "ruinous":
      return "text-purple-400";
    case "aether":
      return "text-pink-400";
    default:
      return "text-zinc-300";
  }
}


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
  questsWithReward.value = [];

  try {
    for await (const quest of streamAllQuestsReward(safeUserId.value)) {
      questsWithReward.value.push(quest);
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
      <div v-else-if="questsWithReward.length === 0" class="text-zinc-400">
        No quests available yet.
      </div>

      <div class="grid gap-6" v-else>
        <div v-for="(quest, index) in questsWithReward" :key="quest.quest.questId"
          class="p-4 rounded-xl shadow bg-white/10">

          <div class="flex justify-between items-center">

            <h2 :id="`quest-title-${index}`" class="text-xl font-semibold text-indigo-300">
              {{ quest.quest.title }}
            </h2>

            <span v-if="quest.quest.estimated" :class="`text-base font-semibold ${rankClass(quest.quest.rank)}`">
              {{ quest.quest.rank }}
            </span>

            <span v-else :class="`text-base font-semibold text-white`">
              Not Estimated
            </span>

          </div>

          <div class="flex justify-between items-center">
            <div class="flex flex-wrap gap-2 mt-4">
              <span v-for="tag in quest.quest.tags" :key="tag"
                class="bg-green-600 text-white text-xs px-2 py-1 rounded">
                {{ tag }}
              </span>
            </div>
          </div>


          <div class="flex justify-between items-center mb-1">
            <span :class="`text-sm ${getStatusTextColour(quest.quest.status.toString())} font-semibold mt-4`">{{
              quest.quest.status }}
            </span>
          </div>

          <div class="mt-4 flex items-center">

            <span v-if="quest.reward?.rewardValue != null" class="text-base text-green-400">
              ${{ (quest.reward.rewardValue! / 100).toFixed(2) }}
            </span>

            <span v-else class="font-mono text-sm text-zinc-300">
              No reward
            </span>

            <div class="flex space-x-4 ml-auto">
              <NuxtLink v-if="userType == 'Dev'" :to="`/quest/estimation/${quest.quest.questId}`"
                :id="`estimation-link-${quest.quest.questId}`" :data-testid="`estimation-link-${quest.quest.questId}`"
                class="text-white hover:underline hover:text-teal-300">
                Estimations
              </NuxtLink>
              <NuxtLink :to="`/quest/${quest.quest.questId}`" :id="`details-link-${quest.quest.questId}`"
                :data-testid="`details-link-${quest.quest.questId}`"
                class="text-white hover:underline hover:text-teal-300">
                Details
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
