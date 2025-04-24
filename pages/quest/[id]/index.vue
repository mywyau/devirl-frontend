<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto text-white">
      <h1 class="text-3xl font-bold mb-6">Quest Details</h1>

      <div
        class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 shadow"
      >
        <h2 class="text-2xl font-semibold text-indigo-400 mb-2">
          {{ quest.title }}
        </h2>
        <p class="mb-4 text-gray-300">{{ quest.description }}</p>

        <div class="mb-2">
          <span class="font-semibold">Bounty: </span>
          <span class="text-green-400">{{ quest.bounty }} ETH</span>
        </div>

        <div>
          <span class="font-semibold">Status: </span>
          <span class="text-yellow-300 capitalize">{{ quest.status }}</span>
        </div>

        <div class="mt-6">
          <NuxtLink
            :to="`/quests/${quest.id}/submit`"
            class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
          >
            Submit Work
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();

const quest = {
  id: route.params.id,
  title: "Fix the TypeScript Types in API Client",
  description:
    "We need help cleaning up and strongly typing our API client for better DX and refactoring safety.",
  bounty: 0.1,
  status: "open",
};
</script>

<style scoped></style>
