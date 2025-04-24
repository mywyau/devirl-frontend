<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">🚀 Post a New Quest</h1>

    <form @submit.prevent="submitQuest" class="space-y-4">
      <div>
        <label class="block mb-1 font-medium">Title</label>
        <input
          v-model="title"
          type="text"
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Description</label>
        <textarea
          v-model="description"
          class="w-full p-2 border rounded"
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
          class="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Quest
      </button>
    </form>

    <div v-if="submitted" class="mt-4 text-green-600">
      ✅ Quest submitted successfully!
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" }); // ✅ if you want to be explicit
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

<style scoped></style>
