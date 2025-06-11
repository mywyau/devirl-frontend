<script setup lang="ts">
// Example loot items (mocked)
const lootItems = [
  {
    name: "Golden Keyboard",
    description: "Grants bonus XP for fast submissions completed ahead of deadline",
    rarity: "Legendary",
  },
  {
    name: "Debugger Goggles",
    description: "Earns extra review XP when providing helpful feedback on bug fixes",
    rarity: "Epic",
  },
  {
    name: "Refactor Wand",
    description: "Grants a one-time XP boost when submitting a clean, well-structured PR",
    rarity: "Rare",
  },
  {
    name: "Coffee Potion",
    description: "Increases daily quest limit temporarily (e.g., +1 extra quest allowed today)",
    rarity: "Common",
  },
  {
    name: "Merge Shield",
    description: "Prevents penalty XP from failed or rejected quests once per week",
    rarity: "Epic",
  },
  {
    name: "Stack Overflow Ring",
    description: "Doubles XP earned from answering or reviewing others’ questions today",
    rarity: "Legendary",
  },
];

</script>

<template>
    <NuxtLayout>
        <div class="min-h-screen text-white px-6 py-10">
            <h1 class="text-3xl font-bold mb-10 text-center">Inventory</h1>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <div v-for="item in lootItems" :key="item.name"
                    class="rounded-xl p-5 border hover:bg-zinc-700 transition-shadow shadow-md">
                    <div class="flex justify-between items-start mb-2">
                        <h2 class="text-lg font-semibold">{{ item.name }}</h2>
                        <span class="text-xs font-bold uppercase tracking-wider" :class="{
                            'text-yellow-400': item.rarity === 'Legendary',
                            'text-purple-400': item.rarity === 'Epic',
                            'text-blue-400': item.rarity === 'Rare',
                            'text-zinc-400': item.rarity === 'Common',
                        }">
                            {{ item.rarity }}
                        </span>
                    </div>
                    <p class="text-zinc-300 text-sm">{{ item.description }}</p>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>
