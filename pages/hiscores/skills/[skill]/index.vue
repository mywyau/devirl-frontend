<script setup lang="ts">

import { loadConfig } from "@/configuration/ConfigLoader";
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui';

import { languageFormatter, languageOptions, skillOptions } from "@/utils/HiscoresUtils";
import { capitalize } from "@/utils/StringUtils";
import { useRoute } from 'vue-router';

import type { SkillData } from '@/types/schema/SkillDataSchema';
import { ref, watch } from 'vue';

import HiscoreMobileSelect from '@/components/ui/hiscores/HiscoreMobileSelect.vue';
import SkillTable from "@/components/ui/hiscores/skill/SkillTable.vue";
import TotalDevCountMessage from "@/components/ui/hiscores/TotalDevCountMessage.vue";
import TotalLevelPaginationControls from "@/components/ui/hiscores/TotalLevelPaginationControls.vue";

const config = loadConfig();
const baseUrl = config.devQuestBackend.baseUrl.replace(/\/$/, "");

const route = useRoute()
const skillId = route.params.skill?.toString() || 'Questing'

const currentPage = ref(1)
const itemsPerPage = 2
const totalItems = ref(1)
const pagedSkillData = ref<SkillData[]>([])
const hasLoaded = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchTotalCount(skill: string) {
    try {
        const res = await $fetch<{ numberOfDevs: number }>(`${baseUrl}/hiscore/skill/count/${skill.toString()}`)
        console.log("Fetched total count:", res.numberOfDevs);
        totalItems.value = res.numberOfDevs
    } catch (err) {
        error.value = "Failed to fetch total count"
    }
}

async function fetchDataForPage(page: number, skill: string) {
    loading.value = true
    try {
        const offset = (page - 1) * itemsPerPage
        const res = await $fetch<SkillData[]>(`${baseUrl}/hiscore/skill/${skill.toString()}?page=${page}&limit=${itemsPerPage}`)
        pagedSkillData.value = res
    } catch (err) {
        error.value = "Failed to fetch data"
    } finally {
        loading.value = false
    }
}

watch([currentPage, () => route.params.skill], async ([page, skill]) => {
    const newSkill = skill?.toString() || '';
    await fetchTotalCount(newSkill);
    await fetchDataForPage(page, newSkill);
    hasLoaded.value = true
}, { immediate: true });

watch(() => route.params.skill, () => {
    currentPage.value = 1;
});

const mobileView = ref("");

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

        <div class="w-full max-w-screen-2xl mx-auto px-4 pt-10 flex flex-col md:flex-row gap-6 text-white min-h-screen">
            <!-- Left Sidebar -->
            <aside class="hidden lg:block w-full md:w-64 shrink-0 mb-6 md:mb-0">

                <div class="mb-8">
                    <h2 class="font-heading text-lg font-semibold mb-2">Hiscores</h2>
                    <ul class="space-y-2">
                        <li>
                            <NuxtLink :to="`/hiscores/total-level`"
                                class="font-sans block px-3 py-2 rounded hover:bg-teal-400/60 text-sm text-white/90 hover:text-white">
                                Total Level
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div class="mb-8">
                    <h2 class="text-lg font-bold mb-2">Skill Hiscores</h2>
                    <ul class="space-y-2">
                        <li v-for="skill in skillOptions" :key="skill">
                            <NuxtLink :to="`/hiscores/skills/${skill}`"
                                class="block px-3 py-2 rounded text-sm text-white/90 hover:text-white" :class="{
                                    'bg-indigo-500/70 text-white font-semibold': skill === skillId,
                                    'hover:bg-teal-400/60': skill !== skillId
                                }">
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
            <div v-if="hasLoaded" class="flex-1 mx-4 md:mx-20">

                <HiscoreMobileSelect v-model="mobileView" />

                <h1 class="text-3xl text-teal-300 font-bold mb-6 text-center">{{ capitalize(skillId) }}</h1>

                <TotalDevCountMessage :total-items="totalItems" :has-loaded="hasLoaded" />

                <SkillTable :has-loaded="hasLoaded" :paged-data="pagedSkillData" :items-per-page="itemsPerPage" :current-page="currentPage" />

                <TotalLevelPaginationControls v-if="!loading && pagedSkillData.length > 0 && totalItems > itemsPerPage"
                    :page="currentPage" :total="totalItems" :items-per-page="itemsPerPage"
                    @update:page="(newPage) => currentPage = newPage" />
            </div>

        </div>
    </NuxtLayout>
</template>
