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

    <div class="w-full max-w-screen-2xl mx-auto px-4 pt-10 pr-2 pl-2 flex gap-10 text-white min-h-screen">

      <!-- Left Sidebar -->
      <aside class="w-64 shrink-0">
        <div class="mb-8">
          <h2 class="font-heading text-lg font-semibold mb-2">Skill Hiscores</h2>
          <ul class="space-y-2">
            <li v-for="skill in skillLinks" :key="skill">
              <NuxtLink :to="`/hiscores/skills/${skill}`"
                class="block px-3 py-2 rounded hover:bg-teal-400/60 text-sm text-white/90 hover:text-white">
                {{ skill.charAt(0).toUpperCase() + skill.slice(1) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="font-heading text-lg font-semibold mb-2">Language Hiscores</h2>
          <ul class="space-y-2">
            <li v-for="lang in languageLinks" :key="lang">
              <NuxtLink :to="`/hiscores/languages/${lang}`"
                class="font-sans block px-3 py-2 rounded hover:bg-teal-400/60 text-sm text-white/90 hover:text-white">
                {{ lang.charAt(0).toUpperCase() + lang.slice(1) }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1">

        <h1 class="font-heading text-3xl font-semibold mb-6 text-center">Hiscores</h1>

        <div class="w-full max-w-4xl mx-auto">

          <table class="w-full table-auto text-left border-collapse mb-10">
            <thead class="border-b border-white/10 text-white">
              <tr>
                <th class="font-heading py-2">Rank</th>
                <th class="font-heading py-2">Username</th>
                <th class="font-heading py-2">Total Level</th>
                <th class="font-heading py-2">Total XP</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dev, i) in leaderboard" :key="dev.name" class="border-b border-white/5">
                <td class="font-sans py-2">{{ i + 1 }}</td>
                <td class="font-sans py-2 text-indigo-300 font-medium">{{ dev.name }}</td>
                <td class="font-sans py-2">{{ dev.totalLevel }}</td>
                <td class="font-sans py-2">{{ dev.totalXP.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


    </div>
  </NuxtLayout>
</template>
