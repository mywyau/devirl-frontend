<script setup lang="ts">
const skills = [
  {
    name: "Questing",
    level: 50,
    xp: 120000,
    nextLevelXP: 200000,
  },
  {
    name: "Reviewing",
    level: 4,
    xp: 512,
    nextLevelXP: 620,
  },
  {
    name: "Testing",
    level: 4,
    xp: 200,
    nextLevelXP: 400,
  }
]

const languages = [
  {
    name: "Java",
    level: 50,
    xp: 120000,
    nextLevelXP: 200000,
  },
  {
    name: "Python",
    level: 10,
    xp: 7899,
    nextLevelXP: 11899,
  },
  {
    name: "Scala",
    level: 30,
    xp: 100000,
    nextLevelXP: 120000,
  },
  {
    name: "Typescript",
    level: 21,
    xp: 50324,
    nextLevelXP: 69000,
  },
]

</script>
<template>
  <NuxtLayout>
    <div class="max-w-4xl mx-auto p-6 rounded-xl text-white">
      <div class="flex flex-col md:flex-row gap-20">
        <!-- Skills Column -->
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-4 text-center md:text-left">Skills</h2>

          <div v-for="skill in skills" :key="skill.name" class="mb-4">
            <div class="flex justify-between items-center mb-1">
              <span class="text-rose-400 font-medium">{{ skill.name }}</span>
              <span class="text-indigo-300 text-sm">{{ skill.level }} / 99</span>
            </div>
            <div class="w-full bg-zinc-700 h-3 rounded">
              <div class="bg-green-500 h-3 rounded" :style="{ width: (skill.xp / skill.nextLevelXP) * 100 + '%' }">
              </div>
            </div>
            <p class="text-zinc-200/90 text-xs mt-1">{{ skill.xp }} / {{ skill.nextLevelXP }} XP</p>
          </div>
        </div>

        <!-- Languages Column -->
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-4 text-center md:text-left">Languages</h2>

          <div v-for="lang in languages" :key="lang.name" class="mb-4">
            <div class="flex justify-between items-center mb-1">
              <span class="text-blue-400 font-medium">{{ lang.name }}</span>
              <span class="text-indigo-300 text-sm">{{ lang.level }} / 99</span>
            </div>
            <div class="w-full bg-zinc-700 h-3 rounded">
              <div class="bg-green-500/90 h-3 rounded" :style="{ width: (lang.xp / lang.nextLevelXP) * 100 + '%' }">
              </div>
            </div>
            <p class="text-zinc-200/90 text-xs mt-1">{{ lang.xp }} / {{ lang.nextLevelXP }} XP</p>
          </div>
        </div>

      </div>
    </div>
  </NuxtLayout>
</template>
