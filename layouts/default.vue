<script setup lang="ts">
import { loadConfig } from "@/configuration/ConfigLoader";
import { AuthController } from "@/controllers/AuthController";

const auth = new AuthController();

import { useAuthUser } from "~/composables/useAuthUser";

const { user, error } = await useAuthUser();

if (error.value) {
  console.error("Failed to load auth session:", error.value);
}

const loginUrl = `${loadConfig().devIrlFrontend.baseUrl}/api/auth/login`;

const logout = async () => {
  await auth.logoutRequest();
  window.location.href = "/";
};
</script>

<template>
  <div
    class="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-gray-100 font-sans"
  >
    <header
      class="px-6 py-4 border-b border-gray-700 flex justify-between items-center"
    >
      <NuxtLink to="/" class="text-xl font-bold text-white hover:text-gray-300">
        Dev Irl
      </NuxtLink>

      <nav class="space-x-6 flex items-center">
        <NuxtLink to="/quests" class="hover:text-gray-300"
          >View all quests</NuxtLink
        >

        <template v-if="user">
          <NuxtLink to="/client/quest/create" class="hover:text-gray-300"
            >Create a quest
          </NuxtLink>

          <NuxtLink to="/client/quest/edit" class="hover:text-gray-300"
            >Edit a quest
          </NuxtLink>

          <NuxtLink to="/dev/quest/submit" class="hover:text-gray-300"
            >Submit a quest
          </NuxtLink>

          <NuxtLink to="/quest-dashboard" class="hover:text-gray-300"
            >Freelancer Quest Dashboard
          </NuxtLink>

          <NuxtLink to="/client/quest-dashboard" class="hover:text-gray-300"
            >Client Quests Dashboard
          </NuxtLink>

          <button @click="logout" class="hover:text-red-400 text-base">
            Logout
          </button>
        </template>

        <template v-if="user">
          <span class="text-sm text-white/70">Hi, {{ user.name }}</span>
        </template>

        <template v-else>
          <a :href="loginUrl" class="hover:text-cyan-400 text-base"> Login </a>
        </template>
      </nav>
    </header>

    <main class="p-4">
      <slot />
    </main>
  </div>
</template>
