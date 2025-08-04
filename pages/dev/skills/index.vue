<script setup lang="ts">

import { useAuthUser } from '@/composables/useAuthUser';
import { getAllProfileSkillData } from '@/controllers/ProfileController';
import { type ProfileData } from '@/types/schema/ProfileDataSchema';
import { useAsyncData } from 'nuxt/app';
import { computed } from 'vue';


// 2) Resolve the logged-in user (top-level await)
const { data: user, error: userError } = await useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

const {
  data: profileSkillData,
  pending,
  error: fetchError,
} = await useAsyncData(
  `hiscore-${safeUserId}`,
  () => getAllProfileSkillData(safeUserId.value || "No user id found"),
  {
    server: true,
    default: () => [],
  }
);

// Already parsed, so no need to run safeParse again!
const result = computed<ProfileData | null>(() => {
  return profileSkillData.value.find((d) => d.devId === safeUserId.value) ?? null;
});

const progressToNextLevel = (xp: number, nextLevelXp: number): number =>
  Math.min((xp / nextLevelXp) * 100, 100);

const getProgress = (xp: number, nextXp: number): string => {
  const percentage = Math.min((xp / nextXp) * 100, 100);
  return `${percentage.toFixed(1)}%`;
};

</script>


<template>
  <NuxtLayout>

    <div class="max-w-4xl mx-auto p-6 rounded-xl text-white">

      <div class="flex flex-col md:flex-row gap-20">
        <!-- Skills Column -->
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-4 text-center md:text-left">Skills</h2>

          <div v-for="data in result?.skillData" :key="data.skill" class="mb-4">

            <div class="flex justify-between items-center mb-1">
              <span class="text-rose-400 font-medium">{{ data.skill }}</span>

              <div class="flex flex-col items-end">
                <span class="text-indigo-300 text-sm">{{ data.skillLevel }} / 99</span>
                <!-- <p class="text-indigo-300 text-sm">Next level: {{ data.nextLevelXp }} XP</p> -->
              </div>

            </div>

            <div class="w-full bg-zinc-700 h-3 rounded">
              <div class="bg-rose-500 h-3 rounded" :style="{ width: getProgress(data.skillXp, data.nextLevelXp) }">
              </div>
            </div>

            <div class="flex justify-between text-xs text-white mt-1">
              <span>{{ data.skillXp }} XP</span>
              <span class="text-white">Next level: <span class="text-indigo-400">{{ data.nextLevelXp }}</span> XP</span>
            </div>
          </div>
        </div>

        <!-- Languages Column -->
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-4 text-center md:text-left">Languages</h2>

          <div v-for="data in result?.languageData" :key="data.language" class="mb-4">

            <div class="flex justify-between items-center mb-1">

              <span class="text-blue-400 font-medium">{{ data.language }}</span>

              <div class="flex flex-col items-end">
                <span class="text-indigo-300 text-sm">{{ data.languageLevel }} / 99</span>
                <!-- <p class="text-indigo-300 text-sm">Next level: {{ data.nextLevelXp }} XP</p> -->
              </div>
            </div>

            <div class="w-full bg-zinc-700 h-3 rounded">
              <div class="bg-blue-500 h-3 rounded" :style="{ width: getProgress(data.languageXp, data.nextLevelXp) }">
              </div>
            </div>

            <div class="flex justify-between text-xs text-white mt-1">
              <span>{{ data.languageXp }} XP</span>
              <span class="text-white">Next level: <span class="text-indigo-400">{{ data.nextLevelXp }}</span> XP</span>
            </div>

          </div>
        </div>
      </div>

    </div>

  </NuxtLayout>
</template>
