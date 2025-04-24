<script setup lang="ts">
const quests = [
  {
    id: 1,
    title: "Build a dark mode toggle",
    description: "Add a dark/light mode switch using Tailwind and Nuxt state.",
    bounty: 0.05,
  },
  {
    id: 2,
    title: "Create a profile page",
    description: "Build a dynamic user profile view with API integration.",
    bounty: 0.08,
  },
  {
    id: 3,
    title: "Implement Stripe payments",
    description: "Integrate Stripe for quest funding and payouts.",
    bounty: 0.15,
  },
];
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Available Quests</h1>

      <div v-if="false" class="text-gray-500">Loading quests...</div>
      <div v-else-if="false" class="text-red-500">Failed to load quests.</div>
      <div v-else>
        <div v-if="quests.length === 0" class="text-gray-400">
          No quests available yet.
        </div>
        <div class="grid gap-6">
          <div
            v-for="quest in quests"
            :key="quest.id"
            class="border p-4 rounded-xl shadow hover:shadow-md transition bg-white/5 text-white rounded border border-white/10"
          >
            <h2 class="text-xl font-semibold">{{ quest.title }}</h2>
            <p class="text-gray-400 mt-2">{{ quest.description }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="font-mono text-sm text-green-400"
                >💰 {{ quest.bounty }} ETH</span
              >
              <NuxtLink
                :to="`/quest/${quest.id}`"
                class="text-blue-500 hover:underline hover:text-blue-400"
              >
                View Quest →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
