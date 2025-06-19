<script setup lang="ts">
import { useAsyncData, useRequestHeaders } from "#imports";
import { computed, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { streamAllQuestsForUser } from "@/controllers/QuestBackendController";
// import { QuestPartial } from "@/types/quests";
import { useAuthUser } from "@/composables/useAuthUser";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";

// 1) Resolve the logged‐in user (SSR will forward the cookie via useAuthUser)
const { data: user } = await useAuthUser();
const safeUserId = computed(() => user.value?.sub || "");

console.debug("SSR user:", user.value);

// 2) Grab the “cookie” header so we can forward it into our streaming endpoint
const requestHeaders = useRequestHeaders(["cookie"]);

// 3) Fetch the entire list of quests on the server, then serialize to HTML
const {
  data: rawQuests,
  pending,
  error,
} = await useAsyncData<QuestPartial[]>(
  `all-quests-${safeUserId.value}`,
  async () => {
    if (!safeUserId.value) return [];
    // Consume the async iterable on the server and collect into an array:
    const collected: QuestPartial[] = [];
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
    console.debug("SSR rawQuests:", rawQuests.value);
    console.debug("SSR error:", error.value);
  });
}

// 5) Tie isLoading to the pending flag
const isLoading = pending;

// 6) Provide a client‐side “refresh” in case you ever need it
const router = useRouter();
function refreshPage() {
  // Force a full reload (SSRed) of the same route:
  router.go(0);
}
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-pink-300">My Quests</h1>

      <!-- 1) SSR will show “Loading…” while it’s gathering the stream server‐side -->
      <div v-if="isLoading" class="text-zinc-500">Loading quests...</div>

      <!-- 2) If there was an error collecting or validating the streamed data -->
      <div v-else-if="error" class="text-red-500">Failed to load quests.</div>

      <!-- 3) Otherwise, we have rawQuests.value as a fully‐hydrated array -->
      <div v-else>
        <div v-if="rawQuests.length === 0" class="text-zinc-400">
          No quests available yet.
        </div>

        <div class="grid gap-6">
          <div v-for="quest in rawQuests" :key="quest.questId"
            class="p-4 rounded-xl bg-white/10">
            <h2 class="text-xl text-indigo-300 font-semibold">{{ quest.title }}</h2>
            <div class="text-sm text-yellow-400 mt-2">
              Status: {{ quest.status }}
            </div>
            <div class="mt-4 flex justify-between items-center">
              <span class="font-mono text-sm text-green-400">
                💰 {{ quest.bounty || 0.0 }} ETH
              </span>

              <a :href="`/client/quest/${quest.questId}`" rel="external"
                class="text-white hover:underline hover:text-teal-300">
                Details
              </a>

            </div>
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
