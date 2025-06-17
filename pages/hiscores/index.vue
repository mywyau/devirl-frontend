<script setup lang="ts">
// Mocked user leaderboard data
const leaderboard = [
  {
    name: "dev_alex",
    totalLevel: 158,
    totalXP: 1_320_000,
  },
  {
    name: "review_queen",
    totalLevel: 146,
    totalXP: 1_180_000,
  },
  {
    name: "code_monster",
    totalLevel: 140,
    totalXP: 1_090_000,
  },
  {
    name: "fast_dev",
    totalLevel: 132,
    totalXP: 970_000,
  },
  {
    name: "bug_hunter",
    totalLevel: 129,
    totalXP: 920_000,
  },
]

const skillLinks = [
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
          <h2 class="text-lg font-bold mb-2">Skill Hiscores</h2>
          <ul class="space-y-2">
            <li v-for="skill in skillLinks" :key="skill">
              <NuxtLink :to="`/hiscores/skills/${skill}`"
                class="block px-3 py-2 rounded hover:bg-rose-400/60 text-sm text-white/90 hover:text-white">
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
                class="block px-3 py-2 rounded hover:bg-lime-400/60 text-sm text-white/90 hover:text-white">
                {{ lang.charAt(0).toUpperCase() + lang.slice(1) }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1">

        <h1 class="text-3xl font-bold mb-6 text-center">Hiscores</h1>

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
            <tr v-for="(dev, i) in leaderboard" :key="dev.name" class="border-b border-white/5">
              <td class="py-2">{{ i + 1 }}</td>
              <td class="py-2 text-indigo-300 font-medium">{{ dev.name }}</td>
              <td class="py-2">{{ dev.totalLevel }}</td>
              <td class="py-2">{{ dev.totalXP.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>


    </div>
  </NuxtLayout>
</template>
