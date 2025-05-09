<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { Button } from "~/components/ui/button/variants";

const quests = ref<any[]>([]);
const page = ref(1);
const limit = 10;
const isLoading = ref(false);
const hasMore = ref(true);
const error = ref<string | null>(null);
const bottomRef = ref<HTMLElement | null>(null);

const userId = "google-oauth2|115481780172182428557";

async function loadQuests() {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    const res = await fetch(
      `http://localhost:8080/dev-quest-service/quest/stream/${encodeURIComponent(
        userId
      )}?page=${page.value}&limit=${limit}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok || !res.body) throw new Error("Failed to fetch quests.");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let newItemsCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        try {
          const quest = JSON.parse(line);
          quests.value.push(quest); // ✅ append quest
          newItemsCount++;
        } catch (e) {
          console.warn("Malformed line:", line);
        }
      }
    }

    if (newItemsCount < limit) hasMore.value = false;
    page.value++;
  } catch (err) {
    console.error(err);
    error.value = "Failed to load quests.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadQuests(); // initial load

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadQuests(); // fetch next page
      }
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    }
  );

  const waitAndObserve = () => {
    nextTick(() => {
      if (bottomRef.value) {
        observer.observe(bottomRef.value);
      }
    });
  };

  // Observe when DOM updates
  watch(quests, waitAndObserve);
});

</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-white">Available Quests</h1>

      <div v-if="error" class="text-red-500">{{ error }}</div>
      <div v-else>
        <div v-if="quests.length === 0 && isLoading" class="text-gray-500">
          Loading quests...
        </div>
        <div v-if="quests.length === 0 && !isLoading" class="text-gray-400">
          No quests available yet.
        </div>

        <div class="grid gap-6">
          <div
            v-for="quest in quests"
            :key="quest.questId"
            class="border p-4 rounded-xl shadow hover:shadow-md transition bg-white/5 text-white border border-white/10"
          >
            <h2 class="text-xl font-semibold">{{ quest.title }}</h2>
            <p class="text-gray-400 mt-2">{{ quest.description }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="font-mono text-sm text-green-400"
                >💰 {{ quest.bounty || 0.0 }} ETH</span
              >
              <NuxtLink
                :to="`/quest/${quest.questId}`"
                class="text-blue-400 hover:underline hover:text-blue-300"
              >
                <Button
                  variant="default"
                  class="bg-blue-500 text-white rounded hover:bg-blue-400"
                >
                  View Quest →
                </Button>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div ref="bottomRef" class="h-10" />

        <div v-if="isLoading" class="text-white mt-4">Loading more...</div>
        <div v-if="!hasMore" class="text-gray-500 mt-4">No more quests.</div>
      </div>
    </div>
  </NuxtLayout>
</template>
