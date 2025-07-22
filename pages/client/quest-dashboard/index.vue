<script setup lang="ts">
import { Button } from "@/components/old/button/variants";
import { Card, CardContent } from "@/components/old/card";
import { Separator } from "@/components/old/separator";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
} from "reka-ui";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const statuses = [
  { key: "estimated", label: "Estimated", color: "indigo" },
  { key: "open", label: "Open", color: "teal" },
  { key: "not-started", label: "Not Started", color: "gray" },
  { key: "in-progress", label: "In Progress", color: "yellow" },
  { key: "review", label: "Review", color: "blue" },
  { key: "completed", label: "Completed", color: "green" },
  { key: "failed", label: "Failed", color: "red" },
];

const clientStats = ref({
  totalQuests: 12,
  questsFailed: 3,
  questsCompleted: 7,
  questsRewarded: 6,
  completionRewardPaid: 6,
})

// Helper for percentages
function percent(part: number, total: number): string {
  return total === 0 ? '0%' : `${Math.round((part / total) * 100)}%`
}


function goToViewAll() {
  router.push("/client/quests/view-all");
}

function goToCreate() {
  router.push("/client/quest/create");
}

function goToStatusPage(key: string) {
  router.push(`/client/quest-dashboard/${key}`);
}
</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto">
      <ContextMenuRoot>
        <!-- Entire card is right-clickable and clickable -->
        <ContextMenuTrigger as-child>

          <div class="cursor-default">

            <Card class="bg-white/5 text-white hover:bg-white/10 transition">
              <CardContent class="p-6 space-y-6">
                
                <div class="flex items-center justify-between mb-4">
                  <h1 class="font-heading text-4xl font-extrabold tracking-tight">
                    Quest Dashboard
                  </h1>
                </div>

                <!--  DESKTOP HINT -->

                <div class="hidden md:block text-base text-green-400 mt-2">
                  Right-click anywhere on the card for more actions
                </div>

                <div class="mt-10 border-t border-zinc-700 pt-6">
                  <h2 class="text-xl text-teal-300 font-semibold mb-4 text-center">
                    Stats
                  </h2>

                  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-white text-center">
                    <div class="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                      <p class="text-sm text-white mb-2">Quests Failed</p>
                      <p class="text-xl font-bold text-red-400">
                        {{ percent(clientStats.questsFailed, clientStats.totalQuests) }}
                      </p>
                      <Separator class="bg-zinc-600 my-2 h-px w-full" />
                      <p class="text-sm text-white">
                        {{ clientStats.questsFailed }} / {{ clientStats.totalQuests }}
                      </p>
                    </div>

                    <div class="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                      <p class="text-sm text-white mb-2">Quests Completed</p>
                      <p class="text-xl font-bold text-green-400">
                        {{ percent(clientStats.questsCompleted, clientStats.totalQuests) }}
                      </p>
                      <Separator class="bg-zinc-600 my-2 h-px w-full" />
                      <p class="text-sm text-white">
                        {{ clientStats.questsCompleted }} / {{ clientStats.totalQuests }}
                      </p>
                    </div>

                    <div class="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                      <p class="text-sm text-white mb-2">Quests Paid Out</p>
                      <p class="text-xl font-bold text-blue-400">
                        {{ percent(clientStats.questsRewarded, clientStats.totalQuests) }}

                      </p>
                      <Separator class="bg-zinc-600 my-2 h-px w-full" />
                      <p class="text-sm text-white">
                        {{ clientStats.questsRewarded }} / {{ clientStats.totalQuests }}
                      </p>
                    </div>

                    <div class="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                      <p class="text-sm text-white mb-2">Completion Rewards Paid</p>
                      <p class="text-xl font-bold text-indigo-400">
                        {{ percent(clientStats.completionRewardPaid, clientStats.totalQuests) }}

                      </p>
                      <Separator class="bg-zinc-600 my-2 h-px w-full" />
                      <p class="text-sm text-white">
                        {{ clientStats.completionRewardPaid }} / {{ clientStats.totalQuests }}
                      </p>
                    </div>
                  </div>
                </div>


                <Separator />

                <!--  MOBILE HINT -->

                <p class="text-zinc-300 text-base md:hidden">
                  Track your progress and dive into each category below.
                </p>

                <!--  MOBILE STATUS BUTTONS -->
                <div class="flex flex-wrap gap-3 mb-4 md:hidden">
                  <NuxtLink v-for="status in statuses" :key="status.key" :to="`/client/quest-dashboard/${status.key}`">
                    <Button class="capitalize text-white"
                      :class="[`bg-${status.color}-500 hover:bg-${status.color}-400`]">
                      {{ status.label }}
                    </Button>
                  </NuxtLink>
                </div>

                <!-- 📱 MOBILE NAV BUTTONS -->
                <div class="flex flex-wrap gap-3 md:hidden">
                  <NuxtLink to="/client/quests/view-all"
                    class="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-400">
                    View my quests
                  </NuxtLink>

                  <NuxtLink to="/client/quest/create"
                    class="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-500">
                    Create a quest
                  </NuxtLink>
                </div>


              </CardContent>
            </Card>
          </div>
        </ContextMenuTrigger>

        <!-- 🖱️ DESKTOP CONTEXT MENU -->

        <ContextMenuPortal>
          <ContextMenuContent
            class="min-w-[220px] z-50 bg-white rounded-lg p-1 shadow-xl border border-teal-200 text-sm text-teal-900">
            <ContextMenuItem @click="goToViewAll"
              class="px-3 py-2 rounded-md cursor-pointer hover:bg-teal-100 focus:bg-teal-100 outline-none transition">
              View My Quests
            </ContextMenuItem>
            <ContextMenuItem @click="goToCreate"
              class="px-3 py-2 rounded-md cursor-pointer hover:bg-teal-100 focus:bg-teal-100 outline-none transition">
              Create a Quest
            </ContextMenuItem>

            <div class="border-t my-2 border-teal-200" />

            <ContextMenuItem v-for="status in statuses" :key="status.key" @click="goToStatusPage(status.key)"
              class="capitalize px-3 py-2 rounded-md cursor-pointer hover:bg-teal-100 focus:bg-teal-100 outline-none transition">
              {{ status.label }}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenuPortal>



      </ContextMenuRoot>
    </div>
  </NuxtLayout>
</template>
