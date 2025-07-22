<script setup lang="ts">

import { loadConfig } from "@/configuration/ConfigLoader";
import { languageFormatter, languageOptions } from "@/utils/LanguageUtils";
import {
  ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport
} from 'reka-ui';
import { ref, watch } from 'vue';

import TotalLevelPaginationControls from "@/components/ui/hiscores/TotalLevelPaginationControls.vue";

const config = loadConfig();

const baseUrl = config.devQuestBackend.baseUrl.replace(/\/$/, "");

type TotalLevel = {
  devId: string
  username: string
  totalLevel: number
  totalXP: number
}

const currentPage = ref(1)
const itemsPerPage = 2
const totalItems = ref(1)
const pagedData = ref<TotalLevel[]>([])
const loading = ref(false)
const error = ref<string | null>(null)


const skillLinks = [
  'questing',
  'estimating',
]

const loadError = ref(false);
const hasLoaded = ref(false)

async function fetchTotalCount() {
  try {
    const res = await $fetch<{ numberOfDevs: number }>(`${baseUrl}/hiscore/total-level/count`)
    console.log("Fetched total count:", res.numberOfDevs);
    totalItems.value = res.numberOfDevs
  } catch (err) {
    error.value = "Failed to fetch total count"
  }
}

async function fetchDataForPage(page: number) {
  loading.value = true
  try {
    const offset = (page - 1) * itemsPerPage
    const res = await $fetch<TotalLevel[]>(`${baseUrl}/hiscore/total-level?page=${page}&limit=${itemsPerPage}`)
    pagedData.value = res
  } catch (err) {
    error.value = "Failed to fetch data"
  } finally {
    loading.value = false
  }
}

watch(currentPage, async (page) => {
  await fetchTotalCount()
  await fetchDataForPage(page)
  hasLoaded.value = true
}, { immediate: true })

</script>


<template>
  <NuxtLayout>

    <div class="w-full max-w-screen-2xl mx-auto px-4 pt-10 flex flex-col md:flex-row gap-6 text-white min-h-screen">

      <aside class="w-full md:w-64 shrink-0 mb-8 md:mb-0">
        <div class="mb-8">
          <h2 class="font-heading text-lg font-semibold mb-2">Hiscores</h2>
          <ul class="space-y-2">
            <li>
              <NuxtLink :to="`/hiscores`"
                class="font-sans block px-3 py-2 rounded text-sm text-white/90 hover:text-white bg-indigo-500/70 font-semibold">
                Total Level
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="mb-8">
          <h2 class="font-heading text-lg font-semibold mb-2">Skill Hiscores</h2>
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
                  class="block px-3 py-2 rounded hover:bg-teal-400/60 text-sm text-white/90 hover:text-white">
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

        <h1 class="font-heading text-3xl font-semibold mb-6 text-center text-teal-300">Total Level</h1>

        <p v-if="loadError" class="text-red-400 mt-4">
          Could not load leaderboard. Please try again later.
        </p>

        <div v-else-if="!loadError" class="w-full overflow-x-auto">

          <p v-if="hasLoaded" class="text-center w-full text-white mb-10">
            There {{ totalItems === 1 ? 'is' : 'are' }} <span class="text-teal-300 font-bold">{{ totalItems }}</span> developer{{ totalItems === 1 ? '' : 's' }}
          </p>

          <table class="w-full min-w-[500px] table-auto text-left border-collapse mb-10">
            <thead class="border-b border-white/10 text-white">
              <tr>
                <th class="font-heading py-2">Rank</th>
                <th class="font-heading py-2">Username</th>
                <th class="font-heading py-2">Total Level</th>
                <th class="font-heading py-2">Total XP</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dev, i) in pagedData" :key="dev.username" class="border-b border-white/5">
                <!-- <td class="font-sans py-2">{{ i + 1 }}</td> -->
                <td class="font-sans py-2">{{ (currentPage - 1) * itemsPerPage + i + 1 }}</td>
                <td class="font-sans py-2">
                  <NuxtLink :to="`/profile/dev/${dev.username}`"
                    class="text-indigo-300 hover:underline hover:text-indigo-400">
                    {{ dev.username }}
                  </NuxtLink>
                </td>
                <td class="font-sans py-2">{{ dev.totalLevel }}</td>
                <td class="font-sans py-2">{{ dev.totalXP.toLocaleString() }}</td>
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
