<script setup lang="ts">
import { loadConfig } from "@/configuration/ConfigLoader";
import { AuthController } from "@/controllers/AuthController";

const auth = new AuthController();

const { data: user } = await auth.sessionRequest();

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
        <template v-if="user">
          <span class="text-sm text-white/70">Hi, {{ user.name }}</span>
        </template>

        <NuxtLink to="/quests" class="hover:text-gray-300">Quests</NuxtLink>

        <template v-if="user">
          <NuxtLink to="/quests/new" class="hover:text-gray-300"
            >Post Quest</NuxtLink
          >
        </template>

        <template v-if="user">
          <NuxtLink to="/quest-dashboard" class="hover:text-gray-300"
            >Quest Dashboard
          </NuxtLink>
          <button @click="logout" class="hover:text-red-400 text-base">
            Logout
          </button>
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
