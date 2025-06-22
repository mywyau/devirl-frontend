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
  <div
    class="flex flex-col overflow-x-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-black min-h-screen font-sans">
    <header class="bg-zinc-950/90 px-6 py-4 border-b border-zinc-700 flex justify-between items-center">
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

    <main class="flex-grow">
      <slot />
    </main>

    <footer class="bg-zinc-950/90 border-t border-zinc-800 px-6 py-6 text-sm text-zinc-400">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 class="text-white font-semibold text-base mb-1">Dev IRL</h2>
          <p class="text-zinc-500 text-sm">Build your reputation. Complete real-world coding quests.</p>
        </div>

        <div>
          <h3 class="text-white font-semibold text-base mb-1">Explore</h3>
          <ul class="space-y-1">
            <li>
              <NuxtLink to="/quests" class="hover:text-white">Quests</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/faq" class="hover:text-white">FAQ</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="hover:text-white">About</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-semibold text-base mb-1">Company</h3>
          <ul class="space-y-1">
            <li><a href="mailto:team@devirl.com" class="hover:text-white">Contact</a></li>
            <li>
              <NuxtLink to="/privacy" class="hover:text-white">Privacy Policy</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/terms" class="hover:text-white">Terms of Service</NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-6 text-center text-xs text-zinc-600">
        © {{ new Date().getFullYear() }} Dev IRL. All rights reserved.
      </div>
    </footer>

  </div>
</template>
