<script setup lang="ts">
import Footer from "@/components/ui/navbar/Footer.vue";
import MobileDropdown from "@/components/ui/navbar/MobileDropdown.vue";
import { useAuthUser } from "@/composables/useAuthUser";
import { loginUrl, logoutUrl } from "@/controllers/AuthController";
import { Icon } from '@iconify/vue';
import { useCookie } from "nuxt/app";
import { SwitchRoot, SwitchThumb } from 'reka-ui';
import { computed, onMounted, ref, watch } from "vue";

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

const switchState = ref(false);

onMounted(() => {
  const saved = localStorage.getItem('theme') || 'light';
  switchState.value = saved === 'dark';
  document.documentElement.classList.toggle('dark', switchState.value);
});

watch(switchState, (enabled) => {
  document.documentElement.classList.toggle('dark', enabled);
  localStorage.setItem('theme', enabled ? 'dark' : 'light');
});

</script>

<template>

  <div
    class="flex flex-col overflow-x-hidden bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white min-h-screen font-sans">

    <header class="px-6 py-4 flex justify-between items-center relative">

      <NuxtLink to="/"
        class="font-heading text-2xl font-bold text-black hover:text-teal-400 dark:text-white dark:hover:text-teal-400">
        Dev IRL
      </NuxtLink>

      <!-- Mobile menu button -->
      <button @click="mobileOpen = !mobileOpen" class="text-white md:hidden" aria-label="Toggle menu">
        <Icon icon="radix-icons:hamburger-menu" class="w-6 h-6" />
      </button>

      <!-- Desktop nav -->
      <ClientOnly>
        <nav v-if="readyToRender" class="space-x-6 hidden md:flex items-center">

          <!-- Dark Mode Toggle -->
          <div class="hidden md:flex items-center gap-2">

            <label v-if="switchState"
              class="text-black hover:text-teal-500 dark:text-white dark:hover:text-teal-400 text-base leading-none pr-2 select-none"
              for="dark-mode-toggle">
              Light Mode
            </label>

            <label v-else
              class="text-black hover:text-teal-500 dark:text-white dark:hover:text-teal-400 text-base leading-none pr-2 select-none"
              for="dark-mode-toggle">
              Dark Mode
            </label>

            <SwitchRoot id="dark-mode-toggle" v-model="switchState"
              class="w-[32px] h-[20px] shadow-sm flex data-[state=unchecked]:bg-stone-300 data-[state=checked]:bg-stone-800 dark:data-[state=unchecked]:bg-stone-800 dark:data-[state=checked]:bg-stone-700 border border-stone-300 data-[state=checked]:border-stone-700 dark:border-stone-700 rounded-full relative transition-[background] focus-within:outline-none focus-within:shadow-[0_0_0_1px] focus-within:border-stone-800 focus-within:shadow-stone-800">
              <SwitchThumb
                class="w-3.5 h-3.5 my-auto bg-white text-xs flex items-center justify-center shadow-xl rounded-full transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-full" />
            </SwitchRoot>
          </div>

          <NuxtLink to="/hiscores/total-level"
            class="font-heading text-black dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400">
            Hiscores
          </NuxtLink>

          <template v-if="authResolved && isLoggedIn">

            <NuxtLink v-if="isRegistered" to="/view-all/quests"
              class="font-heading text-black dark:text-white hover:text-green-500 dark:hover:text-green-400">
              View all quests
            </NuxtLink>

            <NuxtLink v-else to="/registration"
              class="font-heading text-black dark:text-white hover:text-green-500 dark:hover:text-green-400">
              Registration
            </NuxtLink>

            <NuxtLink v-if="userType === 'Dev'" to="/dev/skills"
              class="font-heading text-black dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400">
              Skills</NuxtLink>

            <NuxtLink v-if="userType === 'Client'" to="/client/quest-dashboard"
              class="font-heading text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400">Dashboard
            </NuxtLink>

            <NuxtLink v-if="userType === 'Dev'" to="/dev/quest-dashboard"
              class="font-heading text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400">Dashboard
            </NuxtLink>

            <NuxtLink v-if="userType === 'Dev'" to="/dev/profile"
              class="font-heading text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
              Profile
            </NuxtLink>

            <NuxtLink v-if="userType === 'Client'" to="/client/profile"
              class="font-heading text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400">Profile
            </NuxtLink>
          </template>


          <a v-if="shouldShowLogout" :href="logoutUrl()"
            class="font-heading dark:text-white hover:text-red-500 dark:hover:text-red-400 text-base">
            Logout
          </a>

          <!-- Login if nobody’s logged in yet, or we’re still waiting on Auth0 -->
          <a v-else-if="shouldShowLogin" :href="loginUrl()"
            class="font-heading dark:text-white hover:text-green-500 dark:hover:text-green-400 text-base">
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
