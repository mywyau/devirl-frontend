<script setup lang="ts">

import { useRoute } from 'nuxt/app';
import { ref, watch } from 'vue';

import { languageFormatter, languageOptions } from "@/utils/LanguageUtils";

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
const totalItems = ref(1)
const pagedData = ref<LanguageData[]>([])
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
    pagedData.value = res
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


const skillLinks = [
  'questing',
  'estimating',
];



</script>


<template>
  <NuxtLayout>

    <div class="w-full max-w-screen-2xl mx-auto px-4 pt-10 flex flex-col md:flex-row gap-6 text-white min-h-screen">

      <!-- Left Sidebar -->
      <aside class="w-full md:w-64 shrink-0 mb-6 md:mb-0">


        <div class="mb-8">
          <h2 class="font-heading text-lg font-semibold mb-2">Hiscores</h2>
          <ul class="space-y-2">
            <li>
              <NuxtLink :to="`/hiscores`"
                class="font-sans block px-3 py-2 rounded hover:bg-teal-400/60 text-sm text-white/90 hover:text-white">
                Total Level
              </NuxtLink>
            </li>
          </ul>
        </div>


        <div class="mb-8">
          <h2 class="text-lg font-bold mb-2">Skill Hiscores</h2>
          <ul class="space-y-2">
            <li v-for="skill in skillLinks" :key="skill">
              <NuxtLink :to="`/hiscores/skills/${skill}`"
                class="block px-3 py-2 rounded hover:bg-teal-400/60 text-sm text-white/90 hover:text-white">
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
                <NuxtLink :to="`/hiscores/languages/${encodeURIComponent(lang)}`"
                  class="block px-3 py-2 rounded text-sm text-white/90 hover:text-white" :class="{
                    'bg-indigo-500/70 text-white font-semibold': lang === languageId,
                    'hover:bg-teal-400/60': lang !== languageId
                  }">
                  {{ languageFormatter(lang.charAt(0).toUpperCase() + lang.slice(1)) }}
                </NuxtLink>
              </li>
            </ul>
          </ScrollAreaViewport>

          <ScrollAreaScrollbar
            class="flex select-none touch-none p-0.5 bg-white/10 hover:bg-white/20 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2.5"
            orientation="vertical">
            <ScrollAreaThumb
              class="flex-1 bg-white/60 hover:bg-white rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollAreaScrollbar>
        </ScrollAreaRoot>



      </aside>

      <!-- Main Content -->
      <div class="flex-1 mr-20 ml-20">

        <h1 class="font-heading text-3xl text-blue-400 font-bold mb-6 text-center">
          {{ capitalize(languageFormatter(languageId)) }}
        </h1>

        <p v-if="hasLoaded" class="text-center w-full text-green-400 mb-10">
          There {{ totalItems === 1 ? 'is' : 'are' }} {{ totalItems }} developer{{ totalItems === 1 ? '' : 's' }}
          for {{ capitalize(languageFormatter(languageId)) }}
        </p>          

        <div class="w-full overflow-x-auto">
          <table class="w-full min-w-[500px] table-auto text-left border-collapse mb-10">
            <thead class="border-b border-white/10 text-white">
              <tr>
                <th class="py-2">Rank</th>
                <th class="py-2">Username</th>
                <th class="py-2">Level</th>
                <th class="py-2">XP</th>
              </tr>
            </thead>
            <tbody>
              <!-- <tr v-for="(dev, i) in pagedData" :key="`${dev.devId}-${dev.skill}`" -->
              <tr v-for="(dev, i) in pagedData" :key="`${dev.devId}-${dev.language}`"
                class="border-b border-white/5 text-white">
                <td class="py-2">{{ (currentPage - 1) * itemsPerPage + i + 1 }}</td>
                <td class="py-2 text-indigo-300">{{ dev.username }}</td>
                <td class="py-2">{{ dev.level }}</td>
                <td class="py-2">{{ dev.xp.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>

          <TotalLevelPaginationControls v-if="!loading && pagedData.length > 0 && totalItems > itemsPerPage"
            :page="currentPage" :total="totalItems" :items-per-page="itemsPerPage"
            @update:page="(newPage) => currentPage = newPage" />
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>
