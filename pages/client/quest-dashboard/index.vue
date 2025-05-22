<script setup lang="ts">
import { useRoute } from "nuxt/app";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "~/components/ui/button/variants";

// Route + status tab helpers
const route = useRoute();

const statuses = [
  { key: "in-progress", label: "In Progress", icon: "⏳" },
  { key: "submitted", label: "Submitted", icon: "📤" },
  { key: "completed", label: "Completed", icon: "✅" },
  { key: "failed", label: "Failed", icon: "❌" },
];

const isActive = (status: string) => route.path.includes(status);
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto text-white">
      <Card class="bg-white/5 border-white/10 text-white">
        <CardContent class="p-6 space-y-6">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-4xl font-extrabold tracking-tight">
              Client Quest Dashboard {{ user?.sub }}
            </h1>
          </div>

          <p class="text-gray-400 text-base">
            Track your progress and dive into each category below.
          </p>

          <Separator />

          <div class="flex items-center justify-between mb-4">
            <div class="flex gap-3 flex-wrap">
              <NuxtLink
                v-for="status in statuses"
                :key="status.key"
                :to="`/client/quest-dashboard/${status.key}`"
              >
                <Button
                  :variant="isActive(status.key) ? 'default' : 'secondary'"
                  class="capitalize"
                >
                  {{ status.label }}
                </Button>
              </NuxtLink>

              <NuxtLink
                to="/client/quests"
                class="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-400"
              >
                View my quests
              </NuxtLink>
            </div>

            <NuxtLink
              to="/client/quest/create"
              class="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500"
            >
              Create Quest
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
