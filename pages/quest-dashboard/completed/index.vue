<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto text-green-300">
      <h1 class="text-3xl font-bold mb-8">Completed Dashboard</h1>

      <div class="grid grid-cols-2 gap-6">
        <div
          v-for="quest in quests"
          :key="quest.id"
          class="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow"
        >
          <h3 class="text-xl font-semibold text-indigo-300">
            {{ quest.title }}
          </h3>
          <p class="text-gray-300 text-sm mt-2 mb-2">{{ quest.description }}</p>
          <p class="text-green-400 font-medium">
            Bounty: {{ quest.bounty }} ETH
          </p>
          <NuxtLink
            v-if="quest.id === '1' || quest.id === '2'"
            :to="`/quest/${quest.id}`"
            class="inline-block mt-3 text-sm text-blue-500 hover:underline"
          >
            View Details
          </NuxtLink>
          <NuxtLink
            v-else
            :to="`/error`"
            class="inline-block mt-3 text-sm text-blue-500 hover:underline"
          >
            View Details
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>


<script setup lang="ts">
const statusColorMap: Record<string, string> = {
  "in progress": "text-yellow-300",
  submitted: "text-blue-400",
  completed: "text-green-300",
  failed: "text-red-300",
};

// Dummy data — replace with API integration later
const quests = [
  {
    id: "1",
    title: "Implement Web3 Wallet Integration",
    description: "Allow users to connect MetaMask and authenticate with Ethereum signatures.",
    bounty: 0.25,
    status: "completed",
  },
  {
    id: "2",
    title: "Refactor Legacy Vue Components",
    description: "Modernize old Vue 2-style components to Vue 3 with Composition API.",
    bounty: 0.18,
    status: "completed",
  },
  {
    id: "3",
    title: "Add Unit Tests for QuestService",
    description: "Increase test coverage for the QuestService and ensure proper error handling.",
    bounty: 0.12,
    status: "completed",
  },
  {
    id: "4",
    title: "Optimize Lighthouse Performance Score",
    description: "Improve core web vitals by reducing initial JavaScript bundle size.",
    bounty: 0.2,
    status: "completed",
  },
];


// Group quests by status
const groupedQuests = computed(() => {
  const map = {
    "in progress": [],
    submitted: [],
    completed: [],
    failed: [],
  } as Record<string, typeof quests>;

  for (const quest of quests) {
    map[quest.status]?.push(quest);
  }

  return map;
});
</script>

<style scoped></style>
