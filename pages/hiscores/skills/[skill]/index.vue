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
</script>

<template>
    <NuxtLayout>
        <div class="max-w-3xl mx-auto p-6">
            <h1 class="text-3xl font-bold text-center text-white mb-6">
                {{ titleCase(skillId) }} Highscores
            </h1>

            <div v-if="pending" class="text-center text-zinc-400">Loading...</div>
            <div v-else-if="fetchError" class="text-center text-red-500">Failed to load highscores.</div>
            <table v-else class="w-full table-auto text-left border-collapse">
                <thead class="border-b border-white/10 text-zinc-300">
                    <tr>
                        <th class="py-2">Rank</th>
                        <th class="py-2">Dev</th>
                        <th class="py-2">Level</th>
                        <th class="py-2">XP</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(dev, i) in skillData"
                        :key="`${dev.devId}-${dev.skill}`"
                        class="border-b border-white/5 text-white"
                    >
                        <td class="py-2">{{ i + 1 }}</td>
                        <td class="py-2 font-medium text-indigo-300">{{ dev.username }}</td>
                        <td class="py-2">{{ dev.level }}</td>
                        <td class="py-2">{{ dev.xp.toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </NuxtLayout>
</template>
