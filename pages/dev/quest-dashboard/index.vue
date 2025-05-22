<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  // layout: "quest-dashboard",
});

// import { useUser } from "~/composables/useUser";
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
          <div>
            <h1 class="text-4xl font-extrabold tracking-tight mb-1">
              Dev Quest Dashboard {{ user?.sub }}
            </h1>
            <p class="text-gray-400 text-base">
              Track your progress and dive into each category below.
            </p>
          </div>

          <Separator />

          <div class="flex flex-wrap gap-3">
            <NuxtLink
              v-for="status in statuses"
              :key="status.key"
              :to="`/dev/quest-dashboard/${status.key}`"
            >
              <Button
                :variant="isActive(status.key) ? 'default' : 'secondary'"
                class="capitalize"
              >
                {{ status.label }}
              </Button>
            </NuxtLink>
          </div>
          
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
