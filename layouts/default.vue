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

<script setup lang="ts">
// import { useFetch } from "#app";
// import { useRuntimeConfig } from "#imports";
import { useAppConfig, useFetch, useRuntimeConfig } from "nuxt/app";

const appConfig = useAppConfig();
const envConfig = useRuntimeConfig().public;

console.log(appConfig.siteName);

if (appConfig.featuresSwitches.payments) {
  console.log("Payments enabled");
}

type SessionUser = {
  name: string;
  email: string;
  sub: string;
};

const { data: user } = await useFetch<SessionUser | null>("/api/auth/session", {
  credentials: "include",
});

// const hasSynced = ref(false);

const callbackUrl = envConfig.auth0CallbackUrl;
const loginUrl = `https://${envConfig.auth0Domain}/authorize?response_type=code&client_id=${envConfig.auth0ClientId}&redirect_uri=${envConfig.auth0CallbackUrl}&scope=openid profile email`;

// console.log('[Auth] Callback URL:', callbackUrl)
// console.log('[Auth] Login URL:', loginUrl)

// console.log('AUTH0_CLIENT_SECRET:', process.env.AUTH0_CLIENT_SECRET);
// console.log('NUXT_PUBLIC_AUTH0_CALLBACK_URL:', process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL);

const logout = async () => {
  await fetch("/api/auth/logout", { credentials: "include" });
  window.location.href = "/";
};
</script>
