<script setup lang="ts">
import { getHiscoreSkill } from '@/controllers/SkillController';
import { useAsyncData } from 'nuxt/app';
import { useRoute } from 'vue-router';

const route = useRoute()
const skillId = route.params.skill?.toString() || 'questing'

// Fetch skill data via useAsyncData (runs on server, then hydrates)
const {
    data: skillData,
    pending,
    error: fetchError,
} = await useAsyncData(
    `hiscore-${skillId}`,
    () => getHiscoreSkill(skillId),
    {
        server: true,
        default: () => [],
    }
);

const titleCase = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


const skillLinks = [
    "questing",
    "reviewing",
    "testing"
]

const languageLinks = [
    "java",
    "python",
    "rust",
    "scala",
    "sql",
    "typescript",
]


</script>

<template>
    <NuxtLayout>

        <div class="w-full max-w-screen-2xl mx-auto px-4 pt-10 pr-2 pl-2 flex gap-10 text-white min-h-screen">
            <!-- Left Sidebar -->
            <aside class="w-64 shrink-0">
                <div class="mb-8">
                    <h2 class="text-lg font-bold mb-2">Skill Hiscores</h2>
                    <ul class="space-y-2">
                        <li v-for="skill in skillLinks" :key="skill">
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

                <div>
                    <h2 class="text-lg font-bold mb-2">Language Hiscores</h2>
                    <ul class="space-y-2">
                        <li v-for="lang in languageLinks" :key="lang">
                            <NuxtLink :to="`/hiscores/languages/${lang}`"
                                class="block px-3 py-2 rounded hover:bg-teal-400/60 text-sm text-white/90 hover:text-white">
                                {{ lang.charAt(0).toUpperCase() + lang.slice(1) }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </aside>

            <!-- Main Content -->
            <div class="flex-1">

                <h1 class="text-3xl text-rose-400 font-bold mb-6 text-center">{{ titleCase(skillId) }}</h1>

                <div class="w-full max-w-4xl mx-auto">
                    <table class="w-full table-auto text-left border-collapse mb-10">
                        <thead class="border-b border-white/10 text-white">
                            <tr>
                                <th class="py-2">Rank</th>
                                <th class="py-2">Username</th>
                                <th class="py-2">Total Level</th>
                                <th class="py-2">Total XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(dev, i) in skillData" :key="`${dev.devId}-${dev.skill}`"
                                class="border-b border-white/5 text-white">
                                <td class="py-2">{{ i + 1 }}</td>
                                <td class="py-2 text-indigo-300">{{ dev.username }}</td>
                                <td class="py-2">{{ dev.level }}</td>
                                <td class="py-2">{{ dev.xp.toLocaleString() }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </NuxtLayout>
</template>
