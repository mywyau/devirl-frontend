<script setup lang="ts">
import { getHiscoreLanguage } from '@/controllers/LanguageController';
import { useAsyncData } from 'nuxt/app';
import { useRoute } from 'vue-router';

const route = useRoute()
const languagesId = route.params.languages?.toString() || 'Rip no langauge found - error'

// Fetch languages data via useAsyncData (runs on server, then hydrates)
const {
    data: languagesData,
    pending,
    error: fetchError,
} = await useAsyncData(
    `hiscore-${languagesId}`,
    () => getHiscoreLanguage(languagesId),
    {
        server: true,
        default: () => [],
    }
);

const titleCase = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


const languagesLinks = [
    "questing",
    "reviewing",
    "testing"
]

const languageLinks = [
    "c_sharp",
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

        <div class="max-w-7xl mx-auto p-6 flex gap-10 text-white">
            <!-- Left Sidebar -->
            <aside class="w-64 shrink-0">
                <div class="mb-8">
                    <h2 class="text-lg font-bold mb-2">Language Hiscores</h2>
                    <ul class="space-y-2">
                        <li v-for="languages in languagesLinks" :key="languages">
                            <NuxtLink :to="`/hiscores/languagess/${languages}`"
                                class="block px-3 py-2 rounded hover:bg-rose-400/60 text-sm text-white/90 hover:text-white">
                                {{ languages.charAt(0).toUpperCase() + languages.slice(1) }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 class="text-lg font-bold mb-2">Language Hiscores</h2>
                    <ul class="space-y-2">
                        <li v-for="lang in languageLinks" :key="lang">
                            <NuxtLink :to="`/hiscores/languages/${lang}`"
                                class="block px-3 py-2 rounded hover:bg-lime-400/60 text-sm text-white/90 hover:text-white">
                                {{ lang.charAt(0).toUpperCase() + lang.slice(1) }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </aside>

            <!-- Main Content -->
            <div class="flex-1">

                <h1 class="text-3xl font-bold mb-6 text-center">{{ titleCase(languagesId) }}</h1>

                <table class="w-full table-auto text-left border-collapse mb-10">
                    <thead class="border-b border-white/10 text-zinc-300">
                        <tr>
                            <th class="py-2">Rank</th>
                            <th class="py-2">Username</th>
                            <th class="py-2">Total Level</th>
                            <th class="py-2">Total XP</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(dev, i) in languagesData" :key="`${dev.devId}-${dev.languages}`"
                            class="border-b border-white/5 text-white">
                            <td class="py-2">{{ i + 1 }}</td>
                            <td class="py-2 font-medium text-indigo-300">{{ dev.username }}</td>
                            <td class="py-2">{{ dev.level }}</td>
                            <td class="py-2">{{ dev.xp.toLocaleString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </NuxtLayout>
</template>
