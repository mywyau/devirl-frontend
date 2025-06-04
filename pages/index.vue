<script setup lang="ts">

const isProd = process.env.NODE_ENV === "production";
console.log("[isProd] ", isProd);


// Public variables (safe to fully print)
console.log("[env] NUXT_PUBLIC_BASE_URL =", process.env.NUXT_PUBLIC_BASE_URL);
console.log("[env] NUXT_PUBLIC_API_BASE =", process.env.NUXT_PUBLIC_API_BASE);
console.log("[env] NUXT_PUBLIC_AUTH0_DOMAIN =", process.env.NUXT_PUBLIC_AUTH0_DOMAIN);
console.log("[env] NUXT_PUBLIC_AUTH0_CLIENT_ID =", process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID);
console.log("[env] NUXT_PUBLIC_AUTH0_CALLBACK_URL =", process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL);
console.log("[env] NUXT_PUBLIC_AUTH0_AUDIENCE =", process.env.NUXT_PUBLIC_AUTH0_AUDIENCE);
console.log("[env] STRIPE_PUBLISHABLE_KEY =", process.env.STRIPE_PUBLISHABLE_KEY);

// Sensitive variables (do NOT print full values!)
console.log("[env] SESSION_SECRET defined =", !!process.env.SESSION_SECRET);
console.log("[env] SESSION_SECRET length =", process.env.SESSION_SECRET?.length);
console.log("[env] AUTH0_CLIENT_SECRET defined =", !!process.env.AUTH0_CLIENT_SECRET);

</script>

<template>
  <NuxtLayout>
    <div
      class="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen flex items-center justify-center px-6"
    >
      <div class="max-w-2xl text-center space-y-6">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">
          Welcome to Dev Irl
        </h1>
        <p class="text-gray-300 text-lg">
          Discover quests, earn rewards, and connect with developers and
          clients.
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>
