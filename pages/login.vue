<template>
  <NuxtLayout>
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
    >
      <div
        class="bg-white/5 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-full max-w-md text-center"
      >
        <h1 class="text-3xl font-bold mb-6">Sign in to Dev Quest</h1>
        <p class="mb-8 text-gray-300">
          Log in to access quests, post jobs, and track submissions.
        </p>

        <button
          @click="login"
          class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Sign in with Auth0
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<!-- <script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";

const { loginWithRedirect } = useAuth0();

function login() {
  loginWithRedirect();
}
</script> -->

<style scoped></style>
