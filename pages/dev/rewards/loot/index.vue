<script setup lang="ts">
const lootRolls = [
    {
        name: "5% XP Boost Token",
        rarity: "Common",
        emoji: "⚡",
    },
    {
        name: "50% XP Boost Token",
        rarity: "Rare",
        emoji: "⚡",
    },
    {
        name: "Code Chest",
        rarity: "Uncommon",
        emoji: "📦",
    },
    {
        name: "Potion of debug",
        rarity: "Common",
        emoji: "🧪",
    },
    {
        name: "Spectral Shortbow",
        rarity: "Rare",
        emoji: "🏹", // Rare weapon 💥
        isRare: true,
    },
    {
        name: "Amulet of Magic",
        rarity: "Mega Rare",
        emoji: "🧿", // Rare Armour 💥
        isMegaRare: true,
    },
    {
        name: "35 Gold pieces",
        rarity: "Common",
        emoji: "💰",
    },
]
</script>

<template>
    <NuxtLayout>
        <div class="max-w-3xl mx-auto p-6">
            <h1 class="text-3xl font-bold text-white text-center mb-4">Rewards</h1>
            <p class="text-zinc-400 text-center mb-6">
                You opened a chest and received:
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="(item, index) in lootRolls" :key="index"
                    class="p-4 rounded-xl border shadow text-white flex items-center space-x-4" :class="[
                        'p-4 rounded-xl shadow-lg text-white flex items-center space-x-4 transition transform duration-300',
                        item.isMegaRare
                            ? 'bg-gradient-to-br from-red-800/80 to-yellow-800/80 border-2 border-red-400 animate-pulse ring-2 ring-red-300/50 scale-105'
                            : item.isRare
                                ? 'bg-gradient-to-br from-indigo-700 to-indigo-900 border-2 border-yellow-400 animate-pulse ring-2 ring-yellow-200/30 scale-100'
                                : 'bg-zinc-800 border border-zinc-600 hover:scale-[1.02]'
                    ]">
                    <span class="text-3xl">{{ item.emoji }}</span>
                    <div>
                        <p class="font-semibold">{{ item.name }}</p>
                        <p class="text-sm" :class="{
                            'text-red-400': item.rarity === 'Mega Rare',
                            'text-yellow-400': item.rarity === 'Rare',
                            'text-green-400': item.rarity === 'Uncommon',
                            'text-zinc-400': item.rarity === 'Common',
                        }">
                            {{ item.rarity }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>
