<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  // layout: "quest-dashboard",
});

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const questId = route.params.id as string;

const title = ref("");
const description = ref("");
const budget = ref(0);
const loading = ref(true);
const success = ref(false);

onMounted(() => {
  // Simulate fetching existing quest data
  setTimeout(() => {
    title.value = "Fix login page";
    description.value =
      "The login form isn't submitting correctly. Needs debugging.";
    budget.value = 200;
    loading.value = false;
  }, 500);
});

function updateQuest() {
  success.value = false;
  loading.value = true;

  setTimeout(() => {
    console.log("Updated quest", {
      id: questId,
      title: title.value,
      description: description.value,
      budget: budget.value,
    });
    loading.value = false;
    success.value = true;
  }, 1000);
}
</script>

<template>
  <NuxtLayout>
    <div class="max-w-3xl mx-auto p-6">
      <Card class="bg-white/5 border-white/10 text-white">
        <CardContent class="p-6 space-y-6">
          <div>
            <h1 class="text-3xl font-bold">Edit Quest</h1>
            <p class="text-gray-400 text-base">
              Update the details of your posted quest.
            </p>
          </div>

          <Separator />

          <form @submit.prevent="updateQuest" class="space-y-4">
            <div>
              <label
                for="quest-title"
                class="block mb-1 text-sm font-medium text-white"
              >
                Quest Title
              </label>
              <input
                id="quest-title"
                v-model="title"
                type="text"
                required
                class="w-full px-4 py-2 rounded bg-white/10 text-white/80 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <p class="mt-1 text-sm text-gray-400">Max 100 characters</p>
            </div>

            <div>
              <label
                for="quest-description"
                class="block mb-1 text-sm font-medium text-white"
              >
                Description
              </label>
              <textarea
                id="quest-description"
                v-model="description"
                rows="4"
                class="w-full px-4 py-2 rounded bg-white/10 text-white/80 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
              </textarea>
            </div>

            <div class="pb-4">
              <label
                for="quest-title"
                class="block mb-2 text-sm font-medium text-white"
              >
                (£) Budget
              </label>
              <input
                id="quest-title"
                v-model="budget"
                type="number"
                required
                min="0"
                class="w-full px-4 py-2 rounded bg-white/10 text-white/80 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <button
              type="submit"
              class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded"
              :disabled="loading"
            >
              {{ loading ? "Saving..." : "Update Quest" }}
            </button>
            
          </form>

          <p v-if="success" class="text-green-500 text-sm">
            Quest updated successfully!
          </p>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
