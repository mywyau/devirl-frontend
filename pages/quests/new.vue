<script setup lang="ts">
definePageMeta({ layout: "default" }); // ✅ if you want to be explicit

import { Button } from "~/components/ui/button/variants";

import { ref } from "vue";

const title = ref("");
const description = ref("");
const bounty = ref(0);
const submitted = ref(false);

function submitQuest() {
  // In real app, you'd post this to an API
  console.log("Quest submitted:", {
    title: title.value,
    description: description.value,
    bounty: bounty.value,
  });
  submitted.value = true;
  title.value = "";
  description.value = "";
  bounty.value = 0;
}
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Post a New Quest</h1>

      <div
        class="bg-white/5 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/10 space-y-4"
      >
        <form @submit.prevent="submitQuest" class="space-y-4">
          <div>
            <label class="block mb-1 font-medium">Title</label>
            <input
              v-model="title"
              type="text"
              class="w-full p-2 bg-white/10 text-white rounded border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>

          <div>
            <label class="block mb-1 font-medium">Description</label>
            <textarea
              v-model="description"
              class="w-full p-2 bg-white/10 text-white rounded border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              rows="4"
              required
            ></textarea>
          </div>

          <div>
            <label class="block mb-1 font-medium">Bounty (ETH)</label>
            <input
              v-model.number="bounty"
              type="number"
              step="0.01"
              min="0"
              class="w-1/3 p-2 bg-white/10 text-white rounded border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              required
            />
          </div>

          <Button
            type="submit"
            variant="default"
            class="bg-cyan-500 text-white rounded hover:bg-cyan-400"
          >
            Create Quest
          </Button>
        </form>
      </div>

      <div v-if="submitted" class="mt-4 text-green-600">
        Quest submitted successfully!
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
