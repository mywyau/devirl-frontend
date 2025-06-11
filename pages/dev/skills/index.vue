<script setup lang="ts">
const skills = [
  {
    name: "Estimation",
    level: 4,
    xp: 200,
    nextLevelXP: 620,
  },
  {
    name: "Questing",
    level: 50,
    xp: 120_000,
    nextLevelXP: 200_000,
  },
  {
    name: "Reviewing",
    level: 4,
    xp: 512,
    nextLevelXP: 620,
  },
  {
    name: "Collaboration",
    level: 4,
    xp: 512,
    nextLevelXP: 620,
  },
  {
    name: "Communication",
    level: 4,
    xp: 450_000,
    nextLevelXP: 650_000,
  },
  {
    name: "Testing",
    level: 4,
    xp: 200,
    nextLevelXP: 620,
  }
]

</script>

<template>
  <NuxtLayout>
    <div class="max-w-md mx-auto p-6 rounded-xl">
      <h2 class="text-white text-xl font-bold mb-4 text-center">📊 Skills Tab</h2>
      <div v-for="skill in skills" :key="skill.name" class="mb-4">
        <div class="flex justify-between items-center mb-1">
          <span class="text-rose-400/90 font-medium">{{ skill.name }}</span>
          <span class="text-indigo-300 text-sm"> {{ skill.level }} / 99</span>
        </div>
        <div class="w-full bg-zinc-700 h-3 rounded">
          <div class="bg-green-500/90 h-3 rounded" :style="{ width: (skill.xp / skill.nextLevelXP) * 100 + '%' }"></div>
        </div>
        <p class="text-zinc-200/90 text-xs mt-1">{{ skill.xp }} / {{ skill.nextLevelXP }} XP</p>
      </div>
    </div>
  </NuxtLayout>
</template>
