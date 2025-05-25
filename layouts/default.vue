<script setup lang="ts">
import { loadConfig } from "@/configuration/ConfigLoader";
import { AuthController } from "@/controllers/AuthController";

const auth = new AuthController();

import { useAuthUser } from "~/composables/useAuthUser";

const { user, error } = await useAuthUser();

const userType = useCookie("user_type"); // reads cookie on client and SSR

if (error.value) {
  console.error("Failed to load auth session:", error.value);
}

const loginUrl = `${loadConfig().devIrlFrontend.baseUrl}/api/auth/login`;
const logoutUrl = `${loadConfig().devIrlFrontend.baseUrl}/api/auth/logout`;
</script>

<template>
  <div
    class="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-gray-100 font-sans"
  >
    <header
      class="px-6 py-4 border-b border-gray-700 flex justify-between items-center"
    >
      <NuxtLink to="/" class="text-xl font-bold text-white hover:text-cyan-300">
        Dev Irl
      </NuxtLink>

      <nav class="space-x-6 flex items-center">
        <template v-if="user">
          <NuxtLink to="/view-all/quests" class="hover:text-cyan-300">
            View all quests
          </NuxtLink>

          <NuxtLink
            v-if="userType === 'Client'"
            to="/client/quest-dashboard"
            class="hover:text-cyan-300"
          >
            Client Quests Dashboard
          </NuxtLink>

          <NuxtLink
            v-if="userType === 'Dev'"
            to="/dev/quest-dashboard"
            class="hover:text-cyan-300"
          >
            Dev Quests Dashboard
          </NuxtLink>

          <NuxtLink
            v-if="userType === 'Dev'"
            to="/dev/profile"
            class="hover:text-cyan-300"
          >
            Dev Profile
          </NuxtLink>

          <NuxtLink
            v-if="userType === 'Client'"
            to="/client/profile"
            class="hover:text-cyan-300"
          >
            Client Profile
          </NuxtLink>

          <a :href="logoutUrl" class="hover:text-red-400 text-base"> Logout </a>
        </template>

        <template v-else>
          <a :href="loginUrl" class="hover:text-green-400 text-base"> Login </a>
        </template>
      </nav>
    </header>

    <main class="p-4">
      <slot />
    </main>
  </div>
</template>
