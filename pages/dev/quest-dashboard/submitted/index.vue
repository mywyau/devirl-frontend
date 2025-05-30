<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto text-blue-400">
      <h1 class="text-3xl font-bold mb-8">Submitted Quests</h1>

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
            class="inline-block mt-3 text-sm text-sky-300 hover:text-sky-200 hover:underline"
          >
            View Details
          </NuxtLink>
          <NuxtLink
            v-else
            :to="`/error`"
            class="inline-block mt-3 text-sm text-sky-300 hover:text-sky-200 hover:underline"
          >
            View Details
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>


<script setup lang="ts">

import { computed } from 'vue';

definePageMeta({
  middleware: "auth",
  // layout: "quest-dashboard",
});

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
    title: "Fix A11y issues",
    description: "Strongly type our API client for better DX.",
    bounty: 0.1,
    status: "Submitted",
  },
  {
    id: "2",
    title: "Add Light Mode Support",
    description: "Implement dark mode support across the entire frontend, including modals and dropdowns.",
    bounty: 0.2,
    status: "Submitted",
  },
  {
    id: "3",
    title: "Improve Mobile Responsiveness",
    description: "Fix layout issues on smaller screen sizes, especially for the dashboard and profile pages.",
    bounty: 0.15,
    status: "Submitted",
  },
  {
    id: "4",
    title: "Optimize Image Loading",
    description: "Implement lazy loading for large assets to improve page performance.",
    bounty: 0.18,
    status: "Submitted",
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
