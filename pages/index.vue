<script setup lang="ts">

const isProd = process.env.NODE_ENV === "production";
console.log("[isProd] ", isProd);

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
