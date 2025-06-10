<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number;
    message: string;
  };
}>();
</script>

<template>
  <NuxtLayout>
    <div
      class="flex flex-col items-center justify-center min-h-screen text-white px-4"
    >
      <h1 class="text-5xl font-bold mb-4 text-red-400">Oops!</h1>
      <p class="text-xl mb-6 text-zinc-300">
        Something went wrong. Please try again later.
      </p>

      <NuxtLink
        to="/"
        class="bg-cyan-500 hover:bg-blue-400 text-white px-6 py-2 rounded"
      >
        Back to Home
      </NuxtLink>

      <div v-if="error" class="mt-6 text-sm text-red-300 max-w-lg text-center">
        {{ error.statusCode }} - {{ error.message }}
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
