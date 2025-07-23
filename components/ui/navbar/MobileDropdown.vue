<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { useAuthUser } from '@/composables/useAuthUser';
import { loginUrl, logoutUrl } from '@/controllers/AuthController';
import { useCookie } from 'nuxt/app';

const props = defineProps<{ mobileOpen: boolean }>();
const emit = defineEmits<{ (e: 'update:mobileOpen', value: boolean): void }>();

const { data: user, pending: authPending } = useAuthUser();
const userType = useCookie('user_type');

const isLoggedIn = computed(() => !!user.value);
const isLoggingIn = computed(() => authPending.value && !user.value);
const shouldShowLogin = computed(() => !isLoggedIn.value || isLoggingIn.value);
const shouldShowLogout = computed(() => isLoggedIn.value);
</script>

<template>
  <transition name="fade">
    <nav
      v-if="mobileOpen"
      class="absolute top-full left-0 right-0 bg-zinc-800 border-t-2 border-b-2 border-white flex flex-col px-6 py-4 space-y-4 md:hidden z-50"
    >
      <NuxtLink
        to="/hiscores/total-level"
        @click="$emit('update:mobileOpen', false)"
        class="text-white hover:text-indigo-400"
      >
        Hiscores
      </NuxtLink>

      <template v-if="isLoggedIn">
        <NuxtLink
          to="/view-all/quests"
          @click="$emit('update:mobileOpen', false)"
          class="text-white hover:text-green-400"
        >
          View all quests
        </NuxtLink>

        <NuxtLink
          v-if="userType === 'Dev'"
          to="/dev/skills"
          @click="$emit('update:mobileOpen', false)"
          class="text-white hover:text-indigo-400"
        >
          Skills
        </NuxtLink>

        <NuxtLink
          v-if="userType === 'Client'"
          to="/client/quest-dashboard"
          @click="$emit('update:mobileOpen', false)"
          class="text-white hover:text-blue-400"
        >
          Dashboard
        </NuxtLink>

        <NuxtLink
          v-if="userType === 'Dev'"
          to="/dev/quest-dashboard"
          @click="$emit('update:mobileOpen', false)"
          class="text-white hover:text-blue-400"
        >
          Dashboard
        </NuxtLink>

        <NuxtLink
          v-if="userType === 'Dev'"
          to="/dev/profile"
          @click="$emit('update:mobileOpen', false)"
          class="text-white hover:text-blue-400"
        >
          Profile
        </NuxtLink>

        <NuxtLink
          v-if="userType === 'Client'"
          to="/client/profile"
          @click="$emit('update:mobileOpen', false)"
          class="text-white hover:text-blue-400"
        >
          Profile
        </NuxtLink>
      </template>

      <a
        v-if="shouldShowLogout"
        @click="$emit('update:mobileOpen', false)"
        :href="logoutUrl()"
        class="text-white hover:text-red-400"
      >
        Logout
      </a>

      <a
        v-else-if="shouldShowLogin"
        @click="$emit('update:mobileOpen', false)"
        :href="loginUrl()"
        class="text-white hover:text-green-400"
      >
        Login
      </a>
    </nav>
  </transition>
</template>


