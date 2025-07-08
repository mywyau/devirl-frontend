<script setup lang="ts">
import { useAsyncData, useRequestHeaders } from "#imports";
import { computed, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { useAuthUser } from "@/composables/useAuthUser";
import { streamAllQuestsForUser } from "@/controllers/QuestController";
import type { QuestWithReward } from "@/types/schema/QuestStatusSchema";
import { getStatusTextColour } from "@/utils/QuestStatusUtils";


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

// 1) Resolve the logged‐in user (SSR will forward the cookie via useAuthUser)
const { data: user } = await useAuthUser();
const safeUserId = computed(() => user.value?.sub || "");

console.debug("SSR user:", user.value);

// 2) Grab the “cookie” header so we can forward it into our streaming endpoint
const requestHeaders = useRequestHeaders(["cookie"]);

// 3) Fetch the entire list of quests on the server, then serialize to HTML
const {
  data: rawQuestsWithReward,
  pending,
  error,
} = await useAsyncData<QuestWithReward[]>(
  `all-quests-${safeUserId.value}`,
  async () => {
    if (!safeUserId.value) return [];
    // Consume the async iterable on the server and collect into an array:
    const collected: QuestWithReward[] = [];
    for await (const quest of streamAllQuestsForUser(safeUserId.value, {
      headers: requestHeaders,
    })) {
      collected.push(quest);
    }
    return collected;
  },
  {
    server: true, // run this on SSR
    lazy: true, // do not refetch on client hydration
    default: () => [],
  }
);

// 4) Log SSR result for debugging
if (process.server) {
  watchEffect(() => {
    console.debug("SSR rawQuestsWithReward:", rawQuestsWithReward.value);
    console.debug("SSR error:", error.value);
  });
}

// 5) Tie isLoading to the pending flag
const isLoading = pending;

// 6) Provide a client‐side “refresh” in case you ever need it
const router = useRouter();

function refreshPage() {
  router.go(0);
}

</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-pink-300">My Quests</h1>

      <div v-if="isLoading" class="text-zinc-500">Loading quests...</div>


      <div v-else-if="error" class="text-red-500">Failed to load quests.</div>

      <div v-else>
        <div v-if="rawQuestsWithReward.length === 0" class="text-zinc-400">
          You have not created any quests or no unable to retrieve any quests.
        </div>

        <div class="grid gap-6">
          <div v-for="quest in rawQuestsWithReward" :key="quest.quest.questId" class="p-4 rounded-xl bg-white/10">

            <div class="flex justify-between items-center">
              <h2 class="text-xl text-indigo-300 font-semibold">{{ quest.quest.title }}</h2>
              <span :class="`text-base font-semibold ${rankClass(quest.quest.rank)}`">
                {{ quest.quest.rank }}
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

            <div class="mt-4 flex justify-between items-center">

              <p class="text-base text-white">
                Time Reward:
                <span v-if="quest.reward?.timeRewardValue != null" class="text-base text-green-400">
                  ${{ (quest.reward.timeRewardValue! / 100).toFixed(2) }}
                </span>

                <span v-else class="font-sans text-sm text-zinc-300">
                  No reward
                </span>
              </p>

              <div class="flex space-x-4 ml-auto">
                <a :href="`/client/quest/${quest.quest.questId}`" rel="external"
                  class="text-white hover:underline hover:text-teal-300">
                  Details
                </a>
              </div>

            </div>

            <p class="text-base text-white mt-4">
              Completion Reward:
              <span v-if="quest.reward?.completionRewardValue != null" class="text-base text-green-400">
                ${{ (quest.reward.completionRewardValue! / 100).toFixed(2) }}
              </span>

              <span v-else class="font-sans text-sm text-zinc-300">
                No reward
              </span>
            </p>

          </div>
        </div>

        <div class="mt-6">
          <button @click="refreshPage" class="text-white underline text-sm">
            Refresh
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
