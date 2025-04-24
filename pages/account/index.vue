<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto text-white">
      <h1 class="text-3xl font-bold mb-8">Your Quest Dashboard</h1>

      <div
        v-for="(quests, status) in groupedQuests"
        :key="status"
        class="mb-10"
      >
        <h2
          class="text-2xl font-semibold capitalize mb-4"
          :class="statusColorMap[status] || 'text-white'"
        >
          {{ status }}
        </h2>

        <div v-if="quests.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="quest in quests"
            :key="quest.id"
            class="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow"
          >
            <h3 class="text-xl font-semibold text-indigo-300">
              {{ quest.title }}
            </h3>
            <p class="text-gray-300 text-sm mb-2">{{ quest.description }}</p>
            <p class="text-green-400 font-medium">
              Bounty: {{ quest.bounty }} ETH
            </p>
            <NuxtLink
              :to="`/quest/${quest.id}`"
              class="inline-block mt-3 text-sm text-cyan-400 hover:underline"
            >
              View Details
            </NuxtLink>
          </div>
        </div>

        <div v-else class="text-gray-400 italic">
          No quests in this category yet.
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const statusColorMap: Record<string, string> = {
  "in progress": "text-yellow-300",
  submitted: "text-blue-300",
  completed: "text-green-300",
  failed: "text-red-300",
};

// Dummy data — replace with API integration later
const quests = [
  {
    id: "1",
    title: "Fix TypeScript Types",
    description: "Strongly type our API client for better DX.",
    bounty: 0.1,
    status: "in progress",
  },
  {
    id: "2",
    title: "Add Dark Mode Support",
    description: "Implement dark mode across the frontend.",
    bounty: 0.2,
    status: "submitted",
  },
  {
    id: "3",
    title: "Fix Auth Redirects",
    description: "Users should be redirected back after login.",
    bounty: 0.15,
    status: "completed",
  },
  {
    id: "4",
    title: "Fix Auth Redirects",
    description: "Users should be redirected back after login.",
    bounty: 0.15,
    status: "failed",
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
