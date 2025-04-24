<script setup lang="ts">
</script>

<template>
  <NuxtLayout>
    <div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen flex items-center justify-center px-6">
      <div class="max-w-2xl text-center space-y-6">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome to Dev Irl</h1>
        <p class="text-gray-300 text-lg">
          Discover quests, earn rewards, and connect with developers and clients.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink to="/quests" class="bg-cyan-500 hover:bg-cyan-400 px-6 py-3 rounded-lg text-white font-semibold transition">Explore Quests</NuxtLink>
          <NuxtLink to="/quests/new" class="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition">Post a Quest</NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
