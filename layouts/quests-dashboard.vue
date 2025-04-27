<script setup lang="ts">

definePageMeta({
  middleware: 'auth',
})

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
          <template v-if="isLoggedIn">
            <span class="text-sm text-white/70">Hi, {{ user?.name }}</span>
          </template>
  
          <NuxtLink to="/quests" class="hover:text-gray-300">Quests</NuxtLink>
          <NuxtLink to="/quests/new" class="hover:text-gray-300"
            >Post Quest
          </NuxtLink>
  
          <template v-if="isLoggedIn">
            <NuxtLink to="/quest-dashboard" class="hover:text-gray-300">
              Quest Dashboard
            </NuxtLink>
          </template>
  
          <template v-if="isLoggedIn">
            <button @click="auth.logout()" class="hover:text-red-400 text-base">
              Logout
            </button>
          </template>
          <template v-else>
            <button @click="auth.login()" class="hover:text-cyan-400 text-base">
              Login
            </button>
          </template>
        </nav>
      </header>
  
      <main class="p-4">
        <slot />
        <!-- <ConsentPopup /> -->
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  // import ConsentPopup from "~/components/ConsentPopup.vue";
  
  import { useAuth } from "@/composables/useAuth";
  
  import type { User } from "@auth0/auth0-spa-js";
  import { onMounted, ref } from "vue";
  
  const auth = useAuth();
  const user = ref<User | null>(null);
  const isLoggedIn = ref(false);
  
  onMounted(async () => {
    isLoggedIn.value = await auth.isAuthenticated();
    if (isLoggedIn.value) {
      user.value = await auth.getUser();
      console.log("Logged in user:", user.value);
    }
  });
  </script>
  
  <style scoped></style>
  