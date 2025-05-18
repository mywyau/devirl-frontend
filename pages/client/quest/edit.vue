<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  // layout: "quest-dashboard",
});

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
              <label class="block mb-1 text-sm">Title</label>
              <Input v-model="title" required />
            </div>

            <div>
              <label class="block mb-1 text-sm">Description</label>
              <Textarea v-model="description" rows="5" required />
            </div>

            <div>
              <label class="block mb-1 text-sm">(£) Budget</label>
              <Input type="number" v-model="budget" required min="0" />
            </div>

            <Button type="submit" :disabled="loading">
              {{ loading ? "Saving..." : "Update Quest" }}
            </Button>
          </form>

          <p v-if="success" class="text-green-500 text-sm">
            ✅ Quest updated successfully!
          </p>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
