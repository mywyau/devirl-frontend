<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const skill = route.params.skill?.toString() || 'questing'

// Mock leaderboard data
const leaderboard = [
    { name: "dev_alex", level: 52, xp: 122000 },
    { name: "coder_rae", level: 49, xp: 113000 },
    { name: "bug_hunter", level: 47, xp: 101200 },
    { name: "review_queen", level: 44, xp: 92500 },
    { name: "speedster", level: 40, xp: 81000 },
]

const titleCase = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
</script>

<template>
    <NuxtLayout>
        <div class="max-w-3xl mx-auto p-6">
            <h1 class="text-3xl font-bold text-center text-white mb-6">
                {{ titleCase(skill) }}
            </h1>

            <table class="w-full table-auto text-left border-collapse">
                <thead class="border-b border-white/10 text-zinc-300">
                    <tr>
                        <th class="py-2">Rank</th>
                        <th class="py-2">Dev</th>
                        <th class="py-2">Level</th>
                        <th class="py-2">XP</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(dev, i) in leaderboard" :key="dev.name" class="border-b border-white/5 text-white">
                        <td class="py-2">{{ i + 1 }}</td>
                        <td class="py-2 font-medium text-indigo-300">{{ dev.name }}</td>
                        <td class="py-2">{{ dev.level }}</td>
                        <td class="py-2">{{ dev.xp.toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </NuxtLayout>
</template>
