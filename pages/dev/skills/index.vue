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
              <span class="text-indigo-300 text-sm">{{ data.skillLevel }} / 99</span>
            </div>
            <div class="w-full bg-zinc-700 h-3 rounded">
              <!-- Add progress bar logic if desired -->
            </div>
            <p class="text-zinc-200/90 text-xs mt-1">{{ data.skillXp }} / {{ 13000000 }} XP</p>
            <!-- <p class="text-zinc-200/90 text-xs mt-1">{{ data.skillXp }} XP</p> -->
          </div>
        </div>

        <!-- Languages Column -->
        <div class="flex-1">
          <h2 class="text-xl font-bold mb-4 text-center md:text-left">Languages</h2>

          <div v-for="data in result?.languageData" :key="data.language" class="mb-4">
            <div class="flex justify-between items-center mb-1">
              <span class="text-blue-400 font-medium">{{ data.language }}</span>
              <span class="text-indigo-300 text-sm">{{ data.languageLevel }} / 99</span>
            </div>

            <!-- XP bar needs the calc for next level tho-->
            <div class="w-full bg-zinc-700 h-3 rounded">
              <!-- Add progress bar logic if desired -->
            </div>

            <!-- <div class="w-full bg-zinc-700 h-3 rounded">
              <div class="bg-green-500 h-3" :style="{ width: progressPercent(data.skillXp, data.skillLevel) + '%' }">
              </div>
            </div> -->

            <p class="text-zinc-200/90 text-xs mt-1">{{ data.languageXp }} / {{ 13000000 }} XP</p>
            <!-- <p class="text-zinc-200/90 text-xs mt-1">{{ data.languageXp }} XP</p> -->
          </div>
        </div>
      </div>

    </div>

  </NuxtLayout>
</template>
