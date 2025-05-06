<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8"
  >
    <div class="max-w-md w-full space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center">
        🎉 Welcome, {{ user?.name || "Guest" }}!
      </h1>

      <p class="text-center text-gray-400">You've successfully logged in.</p>

      <div v-if="user" class="text-center space-y-2">
        <img
          :src="user.picture"
          alt="Profile Picture"
          class="w-20 h-20 mx-auto rounded-full shadow"
        />
        <p>{{ user.email }}</p>
      </div>

      <NuxtLink
        to="/"
        class="block w-full text-center mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
      >
        Go to Dashboard
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false });

import { useFetch } from "#app";

const { data: user } = await useFetch("/api/auth/session", {
  credentials: "include",
});

await useFetch(`http://localhost:8080/auth/session/${user.value.sub}`, {
  method: "POST",
  credentials: "include",
});

</script>
