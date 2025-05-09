<script setup lang="ts">
import { QuestBackendController } from "@/controllers/QuestBackendController";
import { onMounted, ref } from "vue";
import { Button } from "~/components/ui/button/variants";

// const quests = ref<any[]>([]); // Store the quests
// const isLoading = ref(false); // Flag for loading status
// const error = ref<string | null>(null); // Store any error messages

// const userId = "google-oauth2|115481780172182428557"; // User ID

// async function loadAllQuests() {
// isLoading.value = true; // Set loading flag

const quests = ref<any[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const userId = "google-oauth2|115481780172182428557";
const controller = new QuestBackendController();

async function loadAllQuests() {
  isLoading.value = true;
  try {
    // iterate the ND-JSON stream
    for await (const quest of controller.streamAllQuests(userId)) {
      quests.value.push(quest); // every object arrives here
    }
  } catch (e) {
    console.error(e);
    error.value = "Failed to load quests.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadAllQuests(); // Initial load when component is mounted
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
              <span class="font-mono text-sm text-green-400">
                💰 {{ quest.bounty || 0.0 }} ETH
              </span>
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

        <div v-if="isLoading" class="text-white mt-4">Loading more...</div>
      </div>
    </div>
  </NuxtLayout>
</template>
