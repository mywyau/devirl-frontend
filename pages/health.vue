<template>
  <NuxtLayout>
    <div class="p-8 text-center">
      <h1 class="text-3xl font-bold">Backend Health Check</h1>
      <p class="mt-4 text-xl" v-if="status">Status: {{ status }}</p>
      <p class="mt-4 text-xl text-red-500" v-else>
        Loading or failed to fetch...
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const status = ref<string | null>(null);

onMounted(async () => {
  try {
    //   const res = await $fetch(`${config.public.API_URL}/health`)
    const res = await $fetch(`https://api.devirl.com/health`);
    status.value = res;
  } catch (err) {
    console.error("Health check failed:", err);
    status.value = null;
  }
});
</script>
