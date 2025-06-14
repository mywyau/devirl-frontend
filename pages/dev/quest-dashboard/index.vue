<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "~/components/ui/button/variants";

const statuses = [
  { key: "not-started", label: "Not Started", color: "gray" },
  { key: "in-progress", label: "In Progress", color: "yellow" },
  { key: "review", label: "Review", color: "blue" },
  { key: "completed", label: "Completed", color: "green" },
  { key: "failed", label: "Failed", color: "red" },
];
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto text-white">
      <Card class="bg-white/10 text-white">
        <CardContent class="p-6 space-y-6">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-4xl font-extrabold tracking-tight">
              Dev Quest Dashboard
            </h1>
          </div>

          <p class="text-zinc-300 text-base">
            Track your progress and dive into each category below.
          </p>

          <Separator />

          <div class="flex flex-wrap gap-3 mb-4">
            <NuxtLink
              v-for="status in statuses"
              :key="status.key"
              :to="`/dev/quest-dashboard/${status.key}`"
            >
              <Button
                class="capitalize text-white"
                :class="[
                  // base color + hover
                  `bg-${status.color}-500 hover:bg-${status.color}-400`,
                ]"
                variant="default"
              >
                <!-- {{ status.icon }} -->
                {{ status.label }}
              </Button>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
