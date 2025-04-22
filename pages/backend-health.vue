

<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Backend Health</h1>
      <div v-if="pending">⏳ Checking backend...</div>
      <div v-else-if="error">❌ Error: {{ error.message }}</div>
      <div v-else>✅ Response: {{ data }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  const config = useRuntimeConfig()
  const { data, error, pending } = await useFetch(`${config.public.apiBase}/health`)
  console.log(config.public.API_URL)
  </script>
  