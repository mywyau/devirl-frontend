<script setup lang="ts">

import { useRoute } from 'nuxt/app';
import { ref, watch } from 'vue';

import { languageFormatter, languageOptions, skillOptions } from "@/utils/HiscoresUtils";

import HiscoreMobileSelect from '@/components/ui/hiscores/HiscoreMobileSelect.vue';
import LanguageTable from "@/components/ui/hiscores/language/LanguageTable.vue";
import TotalDevCountMessage from "@/components/ui/hiscores/TotalDevCountMessage.vue";
import TotalLevelPaginationControls from "@/components/ui/hiscores/TotalLevelPaginationControls.vue";


import { loadConfig } from '@/configuration/ConfigLoader';
import type { LanguageData } from '@/types/schema/LangaugeSchema';
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui';

import { capitalize } from "@/utils/StringUtils";


const route = useRoute();
const languageId = route.params.language || '';

const config = loadConfig();
const baseUrl = config.devQuestBackend.baseUrl.replace(/\/$/, "");

const currentPage = ref(1)
const itemsPerPage = 2
const totalItems = ref(0)
const pagedLanguageData = ref<LanguageData[]>([])
const hasLoaded = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchTotalCount(language: string) {
  try {
    const res = await $fetch<{ numberOfDevs: number }>(`${baseUrl}/hiscore/language/count/${language.toString()}`)
    console.log("Fetched total count:", res.numberOfDevs);
    totalItems.value = res.numberOfDevs
  } catch (err) {
    error.value = "Failed to fetch total count"
  }
}

async function fetchDataForPage(page: number, language: string) {
  loading.value = true
  try {
    const offset = (page - 1) * itemsPerPage
    const res = await $fetch<LanguageData[]>(`${baseUrl}/hiscore/language/${language.toString()}?page=${page}&limit=${itemsPerPage}`)
    pagedLanguageData.value = res
  } catch (err) {
    error.value = "Failed to fetch data"
  } finally {
    loading.value = false
  }
}

watch(currentPage, async (page) => {
  await fetchTotalCount(languageId)
  console.log("Total items:", totalItems.value);
  await fetchDataForPage(page, languageId)
  hasLoaded.value = true
}, { immediate: true })


const mobileView = ref("");           // initially goes to Total

watch(route, () => {
  // keep select in sync if the URL changes
  mobileView.value = route.params.skill
    ? `skills/${route.params.skill}`
    : route.params.language
      ? `languages/${route.params.language}`
      : "";
});

</script>


<template>
  <NuxtLayout>

    <div
      class="w-full max-w-screen-2xl mx-auto px-4 pt-10 flex flex-col md:flex-row gap-6 text-black dark:text-white min-h-screen">

      <!-- Left Sidebar -->
      <aside class="hidden lg:block w-full md:w-64 shrink-0 mb-6 md:mb-0">

        <div class="mb-8">
          <h2 class="font-heading text-lg font-semibold mb-2">Hiscores</h2>
          <ul class="space-y-2">
            <li>
              <NuxtLink :to="`/hiscores/total-level`"
                class="font-sans block px-3 py-2 rounded hover:bg-teal-500/60 dark:hover:bg-teal-400/60 text-sm text-black/90 hover:text-black dark:text-white/90 dark:hover:text-white">
                Total Level
              </NuxtLink>
            </li>
          </ul>
        </div>


        <div class="mb-8">
          <h2 class="text-lg font-bold mb-2">Skill Hiscores</h2>
          <ul class="space-y-2">
            <li v-for="skill in skillOptions" :key="skill">
              <NuxtLink :id="`${skill.toLowerCase()}-hiscore-side-bar-link`"
                :to="`/hiscores/skills/${skill.toLowerCase()}`"
                class="block px-3 py-2 rounded text-sm hover:bg-teal-500/60 text-black/90 hover:text-black dark:hover:bg-teal-400/60 dark:text-white/90 dark:hover:text-white">
                {{ skill.charAt(0).toUpperCase() + skill.slice(1) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <ScrollAreaRoot class="h-96 relative overflow-hidden" style="--scrollbar-size: 10px">
          <div class="mb-2">
            <h2 class="text-lg font-bold">Language Hiscores</h2>
          </div>

          <ScrollAreaViewport class="w-full h-full pr-2">
            <ul class="space-y-2">
              <li v-for="lang in languageOptions" :key="lang">
                <NuxtLink :id="`${lang.toLowerCase()}-hiscore-side-bar-link`"
                  :to="`/hiscores/languages/${encodeURIComponent(lang).toLowerCase()}`"
                  class="block px-3 py-2 rounded text-sm text-black/90 hover:text-black dark:text-white/90 dark:hover:text-white"
                  :class="{
                    'bg-indigo-500/70  text-black dark:bg-indigo-500/70 dark:text-white font-semibold': lang === languageId,
                    'hover:bg-teal-500/60 dark:hover:bg-teal-400/60': lang !== languageId
                  }">
                  {{ languageFormatter(lang.charAt(0).toUpperCase() + lang.slice(1)) }}
                </NuxtLink>
              </li>
            </ul>
          </ScrollAreaViewport>

          <ScrollAreaScrollbar
            class="flex select-none touch-none p-0.5 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2.5"
            orientation="vertical">
            <ScrollAreaThumb
              class="flex-1 bg-black/60 hover:bg-black dark:bg-white/60 dark:hover:bg-white rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollAreaScrollbar>
        </ScrollAreaRoot>

      </aside>

      <!-- Main Content -->
      <div v-if="hasLoaded" class="flex-1 mx-4 md:mx-20">

        <HiscoreMobileSelect v-model="mobileView" />

        <h1 class="font-heading text-3xl text-teal-500 dark:text-teal-300 font-bold mb-6 text-center">
          {{ capitalize(languageFormatter(languageId)) }}
        </h1>

        <TotalDevCountMessage id="total-level-number-of-devs" :has-loaded="hasLoaded" :total-items="totalItems" />

        <LanguageTable :paged-data="pagedLanguageData" :items-per-page="itemsPerPage" :current-page="currentPage" />

        <TotalLevelPaginationControls v-if="!loading && pagedLanguageData.length > 0 && totalItems > itemsPerPage"
          :page="currentPage" :total="totalItems" :items-per-page="itemsPerPage"
          @update:page="(newPage) => currentPage = newPage" />
      </div>

    </div>
  </NuxtLayout>
</template>
