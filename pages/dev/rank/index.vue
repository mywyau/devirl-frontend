<script setup lang="ts">

const aura = 87400

const breakdown = {
    xp: 3200,
    xpWeight: 17.4,
    completionRate: 92,
    completionWeight: 27.6,
    rating: 4.8,
    ratingWeight: 26.4,
    diversity: 7,
    diversityWeight: 8.4,
    penalties: 0,
    penaltyWeight: 0,
}

const recentQuests = [
    { id: 1, title: 'Fix UI bugs', rank: 'Bronze', xp: 40, rating: 5.0, status: 'Completed' },
    { id: 2, title: 'Add GraphQL API', rank: 'Steel', xp: 70, rating: 4.8, status: 'Completed' },
    { id: 3, title: 'Dockerize Backend', rank: 'Mithril', xp: 90, rating: 5.0, status: 'Completed' },
]

const auraTier = computed(() => {
    if (aura >= 95000) return 'Runious'
    if (aura >= 85000) return 'Demon'
    if (aura >= 75000) return 'Mithril'
    if (aura >= 60000) return 'Steel'
    if (aura >= 40000) return 'Bronze'
    return 'Novice'
})

</script>

<template>
    <NuxtLayout>
        <div class="max-w-4xl mx-auto py-10 px-4">
            <!-- Header -->
            <div class="flex items-center space-x-4 mb-6">
                <div>
                    <h1 class="text-2xl text-white font-bold">JohnDev</h1>
                    <p class="text-lg text-white">
                        Rank: <span class="font-semibold text-red-600">{{ auraTier }}</span>
                    </p>
                    <p class="text-sm text-white mb-6">Next tier: Runious — requires aura ≥ 95,000</p>
                    <p class="text-lg text-white">
                        Aura: {{ aura }}
                    </p>
                </div>
            </div>

            <!-- Rank Breakdown -->
            <div class="mb-8">
                <h2 class="text-xl text-white font-semibold mb-2">Rank Breakdown</h2>
                <ul class="space-y-1 text-white">
                    <li>• XP: {{ breakdown.xp }} (Weighted: {{ breakdown.xpWeight }}%)</li>
                    <li>• Completion Rate: {{ breakdown.completionRate }}% ({{ breakdown.completionWeight }}%)</li>
                    <li>• Quest Diversity: {{ breakdown.diversity }} types ({{ breakdown.diversityWeight }}%)</li>
                    <li>• Penalties: {{ breakdown.penalties }} ({{ breakdown.penaltyWeight }}% deducted)</li>
                </ul>
            </div>

            <!-- Achievements -->
            <!-- <div class="mb-8">
                <h2 class="text-white text-xl font-semibold mb-2">Achievements</h2>
                <ul class="list-disc ml-6 text-white space-y-1">
                    <li>Completed 50 Quests</li>
                    <li>Reviewed 20 Submissions</li>
                </ul>
            </div> -->

            <!-- Recent Quests -->
            <!-- <div>
                <h2 class="text-white text-xl font-semibold mb-2">Recent Quests</h2>
                <div class="space-y-3">
                    <div v-for="quest in recentQuests" :key="quest.id" class="rounded p-4 bg-teal-500 shadow-sm">
                        <p class="text-white font-semibold">
                            {{ quest.title }} — <span class="text-white">{{ quest.rank }}</span>
                        </p>
                        <p class="text-sm text-white">
                            +{{ quest.xp }} XP — {{ quest.rating }}★ — {{ quest.status }}
                        </p>
                    </div>
                </div>
            </div> -->
        </div>
    </NuxtLayout>
</template>

<style scoped>
/* Optional: animate orb glow or aura pulses here */
</style>
