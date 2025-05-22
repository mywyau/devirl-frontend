<script setup lang="ts">
// definePageMeta({ ssr: false });

import { useRuntimeConfig } from "nuxt/app";
import { useAuthUser } from "~/composables/useAuthUser";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";

console.log("[Welcome Page] Setup running...");

const config = useRuntimeConfig();

// 1. Call Nuxt3 backend server and fetch user session
const { user, error } = await useAuthUser();

if (error.value) {
  console.error("Failed to load auth session:", error.value);
}

// 2. Call Scala backend directly
import { onMounted } from "vue";

onMounted(async () => {
  if (user.value?.sub) {
    const devQuestBackendAuthController = new DevQuestBackendAuthController();

    const result =
      await devQuestBackendAuthController.storeCookieSessionInRedis(
        user.value?.sub || "No user id"
      );
  }
});
</script>



<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8"
  >
    <div class="max-w-md w-full space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center">
        🎉 Welcome, {{ user?.name || "Guest" }}!
      </h1>

      <p class="text-center text-gray-400">You've successfully logged in.</p>

      <div v-if="user" class="text-center space-y-2">
        <img
          :src="user.picture"
          alt="Profile Picture"
          class="w-20 h-20 mx-auto rounded-full shadow"
        />
        <p>{{ user.email }}</p>
      </div>

      <NuxtLink
        to="/"
        class="block w-full text-center mt-4 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-md"
      >
        Go to Dashboard
      </NuxtLink>
    </div>
  </div>
</template>

