<script setup lang="ts">

import { useAuthUser } from "@/composables/useAuthUser";
import { loadConfig } from "@/configuration/ConfigLoader";
import { streamAllQuestsReward } from "@/controllers/QuestController";
import type { QuestWithReward } from "@/types/schema/QuestStatusSchema";
import { languageFormatter } from "@/utils/HiscoresUtils";
import { rankClass } from "@/utils/QuestRankUtil";
import { getStatusTextColour, statusFormatter } from "@/utils/QuestStatusUtils";
import { useCookie } from "nuxt/app";
import { computed, ref, watch } from "vue";

import { Icon } from '@iconify/vue';
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot
} from 'reka-ui';


const config = loadConfig();
const baseUrl = config.devQuestBackend.baseUrl.replace(/\/$/, "");

const userType = useCookie("user_type");

const showFeedback = ref(false);
const questsWithReward = ref<QuestWithReward[]>([]);
const totalQuests = ref(0); 

async function fetchTotalQuestCount() {
  const { numberOfQuests } = await $fetch<{ numberOfQuests: number }>(`${baseUrl}/quest/count/not-estimated/and/open`);
  totalQuests.value = numberOfQuests;
}

const loading = ref(false);
const hasLoaded = ref(false);
const error = ref<string | null>(null);

// Get the user session
const { data: user, pending: authPending } = useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

const currentPage = ref(1);
const itemsPerPage = 20;

async function fetchQuestsForPage(page: number) {
  if (!safeUserId.value) return;

  loading.value = true;
  error.value = null;
  showFeedback.value = false;      // hide any previous loading/message
  const newList: QuestWithReward[] = [];

  // Delay feedback appearance
  const feedbackTimer = setTimeout(() => {
    showFeedback.value = true;
  }, 400);

  try {
    // stream into a local array, not directly into questsWithReward
    for await (const quest of streamAllQuestsReward(safeUserId.value, page, itemsPerPage)) {
      newList.push(quest);
    }
    // once everything is here, swap
    questsWithReward.value = newList;
    hasLoaded.value = true
  } catch (err) {
    console.error(err);
    error.value = "Failed to fetch quests.";
  } finally {
    clearTimeout(feedbackTimer);
    loading.value = false;
    showFeedback.value = true;
  }
}

watch([currentPage, safeUserId], async ([page, uid]) => {
  if (uid) {
    await fetchTotalQuestCount();
    await fetchQuestsForPage(page);
  }
}, { immediate: true });

</script>

<template>
  <NuxtLayout>

    <div class="p-6 max-w-4xl mx-auto">

      <h1 class="text-3xl font-bold mb-6 text-teal-300">
        All Available Quests
      </h1>

      <!-- Delayed loading message -->
      <div v-if="showFeedback && (authPending || loading)" class="text-zinc-500">
        Loading quests...
      </div>

      <!-- Delayed "no quests" message -->
      <div v-if="showFeedback && !loading && questsWithReward.length === 0" class="text-zinc-400">
        No quests available yet.
      </div>

      <div v-if="error" class="text-red-500">{{ error }}</div>

      <!-- Pagination Controls -->
      <div class="sticky top-6 z-20 bg-zinc-900/80 backdrop-blur-md py-4">
        <template v-if="hasLoaded && questsWithReward.length > 0 && totalQuests > itemsPerPage">
          <PaginationRoot v-model:page="currentPage" :total="totalQuests" :items-per-page="itemsPerPage"
            :sibling-count="1" show-edges class="mt-8 flex justify-center">

            <PaginationList v-slot="{ items }" class="flex items-center gap-1 text-stone-700 dark:text-white">
              <PaginationFirst
                class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg">
                <Icon icon="radix-icons:double-arrow-left" />
              </PaginationFirst>
              <PaginationPrev
                class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg mr-4">
                <Icon icon="radix-icons:chevron-left" />
              </PaginationPrev>

              <template v-for="(page, index) in items" :key="index">
                <PaginationListItem v-if="page.type === 'page'" :value="page.value"
                  class="w-9 h-9  rounded-lg data-[selected]:!bg-white data-[selected]:shadow-sm data-[selected]:text-black hover:bg-white dark:hover:bg-stone-500/70 transition">
                  {{ page.value }}
                </PaginationListItem>
                <PaginationEllipsis v-else :index="index" class="w-9 h-9 flex items-center justify-center">
                  &hellip;
                </PaginationEllipsis>
              </template>

              <PaginationNext
                class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg ml-4">
                <Icon icon="radix-icons:chevron-right" />
              </PaginationNext>
              <PaginationLast
                class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg">
                <Icon icon="radix-icons:double-arrow-right" />
              </PaginationLast>
            </PaginationList>
          </PaginationRoot>
        </template>
      </div>

      <div class="grid gap-6 mt-6" v-if="questsWithReward.length > 0">
        <div v-for="(quest, index) in questsWithReward" :key="quest.quest.questId"
          class="p-4 rounded-xl shadow bg-white/10 flex flex-col gap-4 sm:gap-6">

          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h2 :id="`quest-title-${index}`" class="text-lg sm:text-xl font-semibold text-indigo-300">
              {{ quest.quest.title }}
            </h2>
            <span v-if="quest.quest.estimated"
              :class="`text-sm sm:text-base font-semibold ${rankClass(quest.quest.rank)}`">
              {{ quest.quest.rank }}
            </span>
            <span v-else class="text-sm sm:text-base font-semibold text-white">
              Not Estimated
            </span>
          </div>

          <div class="flex flex-wrap gap-2 mt-2">
            <span v-for="tag in quest.quest.tags" :key="tag" class="bg-green-600 text-white text-xs px-2 py-1 rounded">
              {{ languageFormatter(tag) }}
            </span>
          </div>

          <div v-if="quest.quest.status != 'NotEstimated'" class="flex justify-between items-center mt-2">
            <span :class="`text-sm ${getStatusTextColour(quest.quest.status.toString())} font-semibold`">
              {{ statusFormatter(quest.quest.status) }}
            </span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-4">

            <p class="text-sm sm:text-base text-white">
              Time Reward:
              <span v-if="quest.reward?.timeRewardValue != null" class="text-green-400">
                ${{ (quest.reward.timeRewardValue! / 100).toFixed(2) }}
              </span>
              <span v-else class="text-zinc-300">No reward</span>
            </p>

            <div class="flex gap-4">
              <NuxtLink v-if="userType == 'Dev'" :to="`/quest/estimation/${quest.quest.questId}`"
                class="text-base text-white hover:underline hover:text-teal-300">
                Estimations
              </NuxtLink>
              <NuxtLink :to="`/quest/${quest.quest.questId}`"
                class="text-base text-white hover:underline hover:text-teal-300">
                Details
              </NuxtLink>
            </div>
          </div>

          <p class="text-sm sm:text-base text-white">
            Completion Bonus:
            <span v-if="quest.reward?.completionRewardValue != null" class="text-green-400">
              ${{ (quest.reward.completionRewardValue! / 100).toFixed(2) }}
            </span>
            <span v-else class="text-zinc-300">No reward</span>
          </p>

        </div>
      </div>

      <!-- Pagination Controls -->
      <template v-if="hasLoaded && questsWithReward.length > 0 && totalQuests > itemsPerPage">
        <PaginationRoot v-model:page="currentPage" :total="totalQuests" :items-per-page="itemsPerPage"
          :sibling-count="1" show-edges class="mt-8 flex justify-center">

          <PaginationList v-slot="{ items }" class="flex items-center gap-1 text-stone-700 dark:text-white">
            <PaginationFirst
              class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg">
              <Icon icon="radix-icons:double-arrow-left" />
            </PaginationFirst>
            <PaginationPrev
              class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg mr-4">
              <Icon icon="radix-icons:chevron-left" />
            </PaginationPrev>

            <template v-for="(page, index) in items" :key="index">
              <PaginationListItem v-if="page.type === 'page'" :value="page.value"
                class="w-9 h-9  rounded-lg data-[selected]:!bg-white data-[selected]:shadow-sm data-[selected]:text-black hover:bg-white dark:hover:bg-stone-500/70 transition">
                {{ page.value }}
              </PaginationListItem>
              <PaginationEllipsis v-else :index="index" class="w-9 h-9 flex items-center justify-center">
                &hellip;
              </PaginationEllipsis>
            </template>

            <PaginationNext
              class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg ml-4">
              <Icon icon="radix-icons:chevron-right" />
            </PaginationNext>
            <PaginationLast
              class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg">
              <Icon icon="radix-icons:double-arrow-right" />
            </PaginationLast>
          </PaginationList>
        </PaginationRoot>
      </template>


    </div>

  </NuxtLayout>
</template>
