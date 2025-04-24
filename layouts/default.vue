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
      <nav class="space-x-6">
        <NuxtLink to="/quests" class="hover:text-gray-300">Quests</NuxtLink>
        <NuxtLink to="/quests/new" class="hover:text-gray-300"
          >Post Quest</NuxtLink
        >
        <NuxtLink to="/account" class="hover:text-gray-300">Account</NuxtLink>
        <NuxtLink to="/login" class="hover:text-gray-300">Login</NuxtLink>
      </nav>
    </header>

    <main class="p-4">
      <slot />
      <ConsentPopup />
    </main>
  </div>
</template>

<script setup>
import ConsentPopup from "~/components/ConsentPopup.vue";
</script>

<style scoped></style>
