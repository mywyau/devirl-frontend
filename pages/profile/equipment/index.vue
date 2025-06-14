<script setup lang="ts">
import { computed, ref } from 'vue';

interface EquipmentSlot {
    slot: "Head" | "Chest" | "Amulet" | "Legs" | "Weapon" | "Offhand";
    item?: {
        name: string;
        emoji: string;
        xpMultiplier: number; // e.g., 0.1 = +10%
        bonusLoot?: number; // e.g., 0.1 = +10%
        skillBoost?: string;  // e.g., "Questing"
        rarity: "Common" | "Uncommon" | "Rare" | "Mega Rare";
    };
}


const equipment = ref<EquipmentSlot[]>([
    { slot: "Head", item: null },
    {
        slot: "Amulet",
        item: {
            name: "Mystic Amulet",
            emoji: "🧿",
            xpMultiplier: 0.02,
            skillBoost: "Reviewing",
            rarity: "Mega Rare",
        },
    },
    { slot: "Chest", item: null },
    {
        slot: "Legs", item:
        {
            name: "Thief's Trousers",
            emoji: "👖",
            rarity: "Uncommon",
            xpMultiplier: 0.05,
            bonusLoot: 0.1, // 10% chance on quest complete
        }
    },
    {
        slot: "Weapon",
        item: {
            name: "Spectral Shortbow",
            emoji: "🏹",
            xpMultiplier: 0.075,
            skillBoost: "Questing",
            rarity: "Rare",
        },
    },
    { slot: "Off-Hand", item: null },
])

const totalXpBoost = computed(() =>
    equipment.value.reduce((sum, eq) => sum + (eq.item?.xpMultiplier || 0), 0)
)
</script>

<template>
    <NuxtLayout>
        <div class="max-w-2xl mx-auto p-6">
            <h1 class="text-3xl font-bold text-white text-center mb-4">🛡️ Equipment</h1>

            <div class="mt-8 mb-8 text-center text-white text-lg">
                Total XP Boost: <span class="text-green-400">+{{ Math.floor(totalXpBoost * 100) }}%</span>
            </div>

            <div class="grid grid-cols-1 gap-6">
                <div v-for="slot in equipment" :key="slot.slot"
                    class="bg-zinc-800 border border-zinc-600 rounded-lg p-4 flex flex-col items-center justify-center text-white text-center">
                    <p class="text-sm uppercase text-zinc-400 mb-2">{{ slot.slot }}</p>
                    <div v-if="slot.item">
                        <div class="text-3xl mb-1">{{ slot.item.emoji }}</div>
                        <p class="font-semibold">{{ slot.item.name }}</p>
                        <p class="text-xs text-green-400">
                            +{{ Math.floor(slot.item.xpMultiplier * 100) }}% {{ slot.item.skillBoost }} XP
                        </p>
                        <p class="text-xs text-green-400">
                            +{{ Math.floor((slot.item.bonusLoot || 0) * 100) }}% Bonus Loot Drop Rate
                        </p>
                    </div>
                    <div v-else class="text-zinc-500 text-sm">Empty</div>
                </div>
            </div>

        </div>
    </NuxtLayout>
</template>
