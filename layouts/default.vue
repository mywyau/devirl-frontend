
<template>
    <div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-gray-100 font-sans">
      <header class="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        
        <NuxtLink to="/" class="text-xl font-bold text-white hover:text-brand">
          Dev Quest
        </NuxtLink>
        <nav class="space-x-6">
          <NuxtLink to="/quests" class="hover:text-brand">Quests</NuxtLink>
          <NuxtLink to="/quests/new" class="hover:text-brand">Post Quest</NuxtLink>
          <NuxtLink to="/dashboard" class="hover:text-brand">Dashboard</NuxtLink>
        </nav>
      </header>
  
      <main class="p-6">
        <slot />
      </main>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  </style>
  