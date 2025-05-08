<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto text-white">
      <h1 class="text-3xl font-bold mb-6">Quest Details</h1>

      <div
        class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 shadow"
      >
        <h2 class="text-2xl font-semibold text-indigo-300 mb-2">
          {{ result?.title }}
        </h2>
        <p class="mb-4 text-gray-300">{{ result?.description }}</p>

        <div>
          <span class="font-semibold">Status: </span>
          <span class="text-yellow-300 capitalize">{{ result?.status }}</span>
        </div>

        <div class="mt-6 flex gap-4">
          <NuxtLink :to="`/quest/${result?.id}/submit`" class="">
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
import { QuestBackendController } from "@/controllers/QuestBackendController";
import { QuestPartial } from "@/types/quests/QuestPartial";
import { Button } from "~/components/ui/button/variants";

// const route = useRoute();

const questController = new QuestBackendController();

const result: QuestPartial | null = await questController.getQuest("QUEST001")

</script>

<style scoped></style>
