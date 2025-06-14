<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { loadConfig } from "@/configuration/ConfigLoader";
import { useCookie } from "nuxt/app";

const { data: user, error } = useAuthUser();

const userType = useCookie("user_type"); // reads cookie on client and SSR

if (error.value) {
  console.error("Failed to load auth session:", error.value);
}

const loginUrl = `${loadConfig().devIrlFrontend.baseUrl}/api/auth/login`;
const logoutUrl = `${loadConfig().devIrlFrontend.baseUrl}/api/auth/logout`;

const handleLogout = () => {
  // Full browser redirect ensures session is reset on both client and server
  window.location.href = "/api/auth/logout";
};
</script>

<template>
  <div class="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black min-h-screen font-sans">
    <header class="px-6 py-4 border-b border-zinc-700 flex justify-between items-center">
      <NuxtLink to="/" class="text-xl font-bold text-white hover:text-teal-400">
        Dev Irl
      </NuxtLink>

      <nav class="space-x-6 flex items-center">
        <template v-if="user">
          <NuxtLink to="/view-all/quests" class="text-white hover:text-green-400">
            View all quests
          </NuxtLink>

          <NuxtLink to="/hiscores" class="text-white hover:text-indigo-400">
            Hiscores
          </NuxtLink>

          <NuxtLink v-if="userType === 'Dev'" to="/dev/skills" class="text-white hover:text-indigo-400">
            Skills
          </NuxtLink>

          <NuxtLink v-if="userType === 'Client'" to="/client/quest-dashboard" class="text-white hover:text-blue-400">
            Client Quests Dashboard
          </NuxtLink>

          <NuxtLink v-if="userType === 'Dev'" to="/dev/quest-dashboard" class="text-white hover:text-blue-400">
            Dev Quests Dashboard
          </NuxtLink>

          <NuxtLink v-if="userType === 'Dev'" to="/dev/profile" class="text-white hover:text-blue-400">
            Dev Profile
          </NuxtLink>

          <NuxtLink v-if="userType === 'Client'" to="/client/profile" class="text-white hover:text-blue-400">
            Client Profile
          </NuxtLink>

          <a href="#" @click.prevent="handleLogout" class="text-white hover:text-red-400 text-base">Logout</a>
        </template>

        <template v-else>

          <NuxtLink to="/hiscores" class="text-white hover:text-indigo-300">
            Hiscores
          </NuxtLink>

          <a :href="loginUrl" class=" text-white hover:text-green-400 text-base">
            Login
          </a>
        </template>
      </nav>
    </header>

    <main class="p-4">
      <slot />
    </main>
  </div>
</template>
