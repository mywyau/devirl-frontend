<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto text-white">
      <h1 class="text-3xl font-bold mb-6">Quest Details</h1>

      <!-- Loading state -->
      <div v-if="pending" class="text-gray-400">Loading quest...</div>

      <!-- Quest Details -->
      <div
        v-else
        class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 shadow"
      >
        <h2 class="text-2xl font-semibold text-indigo-300 mb-2">
          {{ quest?.title }}
        </h2>
        <p class="mb-4 text-gray-300">{{ quest?.description }}</p>

        <div class="mb-2">
          <span class="font-semibold">Bounty: </span>
          <span class="text-green-400">{{ quest?.bounty }} ETH</span>
        </div>

        <div>
          <span class="font-semibold">Status: </span>
          <span class="text-yellow-300 capitalize">{{ quest?.status }}</span>
        </div>

        <div class="mt-6 flex gap-4">
          <NuxtLink :to="`/quest/${quest?.id}/submit`" class="">
            <Button
              variant="secondary"
              class="bg-green-600 text-white rounded hover:bg-green-500"
            >
              Take on quest
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">

import { useAsyncData, useRoute } from "nuxt/app";
import { Button } from "~/components/ui/button/variants";

const route = useRoute();

// Simulated backend data
const { data: quest } = await useAsyncData("quest", async () => {
  const quests = [
    {
      id: "1",
      title: "Fix the TypeScript Types in API Client",
      description:
        "We need help cleaning up and strongly typing our API client for better DX and refactoring safety.",
      bounty: 0.1,
      status: "open",
    },
    {
      id: "2",
      title: "Dark Mode Support",
      description: "Add a dark mode toggle to the UI.",
      bounty: 0.2,
      status: "completed",
    },
  ];

  const found = quests.find((q) => q.id === route.params.id);

  if (!found) {
    throw createError({
      statusCode: 404,
      statusMessage: "Quest not found",
    });
  }

  return found;
});
</script>

<style scoped></style>
