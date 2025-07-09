<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { loginUrl, logoutUrl } from "@/controllers/AuthController";
import { useCookie } from "nuxt/app";
import { ref } from "vue";
import { Icon } from '@iconify/vue';


const mobileOpen = ref(false);

const { data: user, error } = useAuthUser();

const userType = useCookie("user_type"); // reads cookie on client and SSR

if (error.value) {
  console.error("Failed to load auth session:", error.value);
}
</script>

<template>

  <div class="flex flex-col overflow-x-hidden bg-zinc-900 min-h-screen font-sans">
    <header class="px-6 py-4 flex justify-between items-center relative">
      <NuxtLink to="/" class="font-heading text-2xl font-bold text-white hover:text-teal-400">
        Dev IRL
      </NuxtLink>

      <!-- Mobile menu button -->
      <button @click="mobileOpen = !mobileOpen" class="text-white md:hidden" aria-label="Toggle menu">
        <Icon icon="radix-icons:hamburger-menu" class="w-6 h-6" />
      </button>

      <!-- Desktop nav -->
      <nav class="space-x-6 hidden md:flex items-center">
        <template v-if="user">
          <NuxtLink to="/view-all/quests" class="font-heading text-white hover:text-green-400">View all quests
          </NuxtLink>
          <NuxtLink to="/hiscores" class="font-heading text-white hover:text-indigo-400">Hiscores</NuxtLink>
          <NuxtLink v-if="userType === 'Dev'" to="/dev/skills" class="font-heading text-white hover:text-indigo-400">
            Skills</NuxtLink>
          <NuxtLink v-if="userType === 'Client'" to="/client/quest-dashboard"
            class="font-heading text-white hover:text-blue-400">Dashboard</NuxtLink>
          <NuxtLink v-if="userType === 'Dev'" to="/dev/quest-dashboard"
            class="font-heading text-white hover:text-blue-400">Dashboard</NuxtLink>
          <NuxtLink v-if="userType === 'Dev'" to="/dev/profile" class="font-heading text-white hover:text-blue-400">
            Profile</NuxtLink>
          <NuxtLink v-if="userType === 'Client'" to="/client/profile"
            class="font-heading text-white hover:text-blue-400">Profile</NuxtLink>
          <NuxtLink to="/about" class="font-heading text-white hover:text-indigo-300">About</NuxtLink>
          <a :href="logoutUrl()" class="font-heading text-white hover:text-red-400 text-base">Logout</a>
        </template>
        <template v-else>
          <NuxtLink to="/hiscores" class="font-heading text-white hover:text-indigo-300">Hiscores</NuxtLink>
          <NuxtLink to="/about" class="font-heading text-white hover:text-indigo-300">About</NuxtLink>
          <a :href="loginUrl()" class="font-heading text-white hover:text-green-400 text-base">Login</a>
        </template>
      </nav>

      <!-- Mobile dropdown nav -->
      <transition name="fade">
        <nav v-if="mobileOpen"
          class="absolute top-full left-0 right-0 bg-zinc-900 border-t border-zinc-700 flex flex-col px-6 py-4 space-y-4 md:hidden z-50">
          <template v-if="user">
            <NuxtLink to="/view-all/quests" class="text-white hover:text-green-400">View all quests</NuxtLink>
            <NuxtLink to="/hiscores" class="text-white hover:text-indigo-400">Hiscores</NuxtLink>
            <NuxtLink v-if="userType === 'Dev'" to="/dev/skills" class="text-white hover:text-indigo-400">Skills
            </NuxtLink>
            <NuxtLink v-if="userType === 'Client'" to="/client/quest-dashboard" class="text-white hover:text-blue-400">
              Dashboard</NuxtLink>
            <NuxtLink v-if="userType === 'Dev'" to="/dev/quest-dashboard" class="text-white hover:text-blue-400">
              Dashboard</NuxtLink>
            <NuxtLink v-if="userType === 'Dev'" to="/dev/profile" class="text-white hover:text-blue-400">Profile
            </NuxtLink>
            <NuxtLink v-if="userType === 'Client'" to="/client/profile" class="text-white hover:text-blue-400">Profile
            </NuxtLink>
            <NuxtLink to="/about" class="text-white hover:text-indigo-300">About</NuxtLink>
            <a :href="logoutUrl()" class="text-white hover:text-red-400 text-base">Logout</a>
          </template>
          <template v-else>
            <NuxtLink to="/hiscores" class="text-white hover:text-indigo-300">Hiscores</NuxtLink>
            <NuxtLink to="/about" class="text-white hover:text-indigo-300">About</NuxtLink>
            <a :href="loginUrl()" class="text-white hover:text-green-400 text-base">Login</a>
          </template>
        </nav>
      </transition>
    </header>


    <main class="flex-grow">
      <slot />
    </main>

    <footer class="bg-zinc-950/90 border-t border-zinc-800 px-6 py-6 text-sm text-zinc-400">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 id="footer-dev-irl" class="text-white font-semibold text-base mb-1">Dev IRL</h2>
          <p class="text-zinc-400 text-sm">Start your journey</p>
        </div>

        <div>
          <h3 class="text-white font-semibold text-base mb-1">Explore</h3>
          <ul class="space-y-1">
            <li>
              <NuxtLink to="/faq" class="hover:text-white hover:underline">FAQ</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-semibold text-base mb-1">Company</h3>
          <ul class="space-y-1">
            <li><a href="mailto:team@devirl.com" class="hover:text-white hover:underline">Contact</a></li>
            <li>
              <NuxtLink to="/privacy-policy" class="hover:text-white hover:underline">Privacy Policy</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/terms-and-conditions" class="hover:text-white hover:underline">Terms of Service</NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-6 text-center text-xs text-zinc-600">
        © {{ new Date().getFullYear() }} Dev IRL. All rights reserved.
      </div>
    </footer>

  </div>
</template>
