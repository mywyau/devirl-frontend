<script setup lang="ts">

// import { useValidatedRuntimeConfig } from "@/configuration/useValidatedRuntimeConfig";
// const runtimeConf = useValidatedRuntimeConfig();

const isProd = process.env.NODE_ENV === "production";
console.debug("[isProd] ", isProd);

// // Public variables (safe to fully print)
// console.debug("[env] NUXT_PUBLIC_BASE_URL =", runtimeConf.devIrlFrontendBaseUrl);
// console.debug("[env] NUXT_PUBLIC_API_BASE =", runtimeConf.apiBase);
// console.debug("[env] NUXT_PUBLIC_AUTH0_DOMAIN =", runtimeConf.auth0Domain);
// console.debug("[env] NUXT_PUBLIC_AUTH0_CLIENT_ID =", runtimeConf.auth0ClientId);
// console.debug("[env] NUXT_PUBLIC_AUTH0_CALLBACK_URL =", runtimeConf.auth0CallbackUrl);
// console.debug("[env] NUXT_PUBLIC_AUTH0_AUDIENCE =", runtimeConf.auth0Audience);
// console.debug("[env] STRIPE_PUBLISHABLE_KEY =", "nah");

// // Sensitive variables (do NOT print full values!)
// console.debug("[env] SESSION_SECRET defined =", !!runtimeConf.sessionSecret);
// console.debug("[env] SESSION_SECRET length =", runtimeConf.sessionSecret?.length);
// console.debug("[env] AUTH0_CLIENT_SECRET defined =", !!process.env.AUTH0_CLIENT_SECRET);

</script>

<template>
  <NuxtLayout>
    <div
      class="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white min-h-screen flex items-center justify-center px-6"
    >
      <div class="max-w-2xl text-center space-y-6">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">
          Welcome to Dev Irl
        </h1>
        <p class="text-zinc-300 text-lg">
          Discover quests, earn rewards, and connect with developers and
          clients.
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>
