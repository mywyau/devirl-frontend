<script setup lang="ts">

import { getHiscoreLanguage } from '@/controllers/LanguageController';
import { useRoute } from 'nuxt/app';
import { ref, watch } from 'vue';

const route = useRoute();

const languageId = ref(route.params.language?.toString() || '');

const languageData = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  try {
    loading.value = true;
    error.value = null;
    const res = await getHiscoreLanguage(languageId.value);
    languageData.value = res;
  } catch (err) {
    error.value = err;
    console.error('Failed to fetch hiscore:', err);
  } finally {
    loading.value = false;
  }
};

// Fetch on mount
await fetchData();

// Watch for changes to the route param
watch(
  () => route.params.language,
  (newLang) => {
    if (newLang) {
      languageId.value = newLang.toString();
      fetchData();
    }
  }
);

const titleCase = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const skillLinks = [
  'questing',
  'estimating', 
  // 'testing'
];

// languages as strings representing enums must be capital with camelcase to match backend enums
const languageLinks = ['Java', 'Python', 'Rust', 'Scala', 'Sql', 'TypeScript'];
</script>


<template>
    <NuxtLayout>

        <div class="w-full max-w-screen-2xl mx-auto px-4 pt-10 pr-2 pl-2 flex gap-10 text-white min-h-screen">

            <!-- Left Sidebar -->
            <aside class="w-64 shrink-0">

                <div class="mb-8">
                  <h2 class="font-heading text-lg font-semibold mb-2">Hiscores</h2>
                  <ul class="space-y-2">
                    <li>
                      <NuxtLink 
                        :to="`/hiscores`"          
                        class="font-sans block px-3 py-2 rounded hover:bg-teal-400/60 text-sm text-white/90 hover:text-white"
                      >
                        Total Level 
                      </NuxtLink>
                    </li>
                  </ul>
                </div>


                <div class="mb-8">
                    <h2 class="text-lg font-bold mb-2">Skill Hiscores</h2>
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
                    <h2 class="text-lg font-bold mb-2">Language Hiscores</h2>

                    <ul class="space-y-2">
                        <li v-for="lang in languageLinks" :key="lang">
                            <NuxtLink :to="`/hiscores/languages/${lang}`"
                                class="block px-3 py-2 rounded text-sm text-white/90 hover:text-white" :class="{
                                    'bg-indigo-500/70 text-white font-semibold': lang === languageId,
                                    'hover:bg-teal-400/60': lang !== languageId
                                }">
                                {{ lang.charAt(0).toUpperCase() + lang.slice(1) }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </aside>

            <!-- Main Content -->
            <div class="flex-1">

                <h1 class="font-heading text-3xl text-blue-400 font-bold mb-6 text-center">{{ titleCase(languageId) }}</h1>

                <div class="w-full max-w-4xl mx-auto">
                    <table class="w-full table-auto text-left border-collapse mb-10">
                        <thead class="border-b border-white/10 text-white">
                            <tr>
                                <th class="py-2">Rank</th>
                                <th class="py-2">Username</th>
                                <th class="py-2">Total Level</th>
                                <th class="py-2">Total XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(dev, i) in languageData" :key="`${dev.devId}-${dev.language}`"
                                class="border-b border-white/5 text-white">
                                <td class="py-2">{{ i + 1 }}</td>
                                <td class="py-2 text-indigo-300">{{ dev.username }}</td>
                                <td class="py-2">{{ dev.level }}</td>
                                <td class="py-2">{{ dev.xp.toLocaleString() }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </NuxtLayout>
</template>
