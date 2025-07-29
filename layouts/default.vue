<script setup lang="ts">
import Footer from "@/components/ui/navbar/Footer.vue";
import MobileDropdown from "@/components/ui/navbar/MobileDropdown.vue";
import { useAuthUser } from "@/composables/useAuthUser";
import { loginUrl, logoutUrl } from "@/controllers/AuthController";
import { Icon } from '@iconify/vue';
import { useCookie } from "nuxt/app";
import { computed, ref } from "vue";

const mobileOpen = ref(false);

const { data: user, pending: authPending, error } = useAuthUser();

const authResolved = computed(() => !authPending.value);

const userType = useCookie("user_type"); // reads cookie on client and SSR

const isLoggedIn = computed(() => !!user.value);
const isLoggingIn = computed(() => authPending.value && !user.value);

const isRegistered = computed(() =>
  authResolved.value &&
  isLoggedIn.value &&
  (userType.value === "Dev" || userType.value === "Client")
);

const shouldShowLogin = computed(() => !isLoggedIn.value || isLoggingIn.value);
const shouldShowLogout = computed(() => isLoggedIn.value);

const readyToRender = computed(() => process.client && authResolved.value);


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
      <ClientOnly>
        <nav v-if="readyToRender" class="space-x-6 hidden md:flex items-center">
          <!-- <template v-if="user"> -->

          <NuxtLink to="/hiscores/total-level" class="font-heading text-white hover:text-indigo-400">
            Hiscores
          </NuxtLink>

          <template v-if="authResolved && isLoggedIn">

            <NuxtLink v-if="isRegistered" to="/view-all/quests" class="font-heading text-white hover:text-green-400">
              View all quests</NuxtLink>

            <NuxtLink v-else to="/registration" class="font-heading text-white hover:text-green-400">Registration
            </NuxtLink>

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
          </template>


          <a v-if="shouldShowLogout" :href="logoutUrl()" class="font-heading text-white hover:text-red-400 text-base">
            Logout
          </a>

          <!-- Login if nobody’s logged in yet, or we’re still waiting on Auth0 -->
          <a v-else-if="shouldShowLogin" :href="loginUrl()"
            class="font-heading text-white hover:text-green-400 text-base">
            Login
          </a>
        </nav>
      </ClientOnly>

      <MobileDropdown v-model:mobileOpen="mobileOpen" />
    </header>


    <main class="flex-grow">
      <slot />
    </main>

    <Footer />

  </div>
</template>
