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

const status = ref<string | null>(null);

onMounted(async () => {
  try {
    const res = await $fetch(`https://devirl.com/dev-quest/health`);
    status.value = res;
  } catch (err) {
    console.error("Health check failed:", err);
    status.value = null;
  }
});
</script>

aws ecs describe-task-definition --task-definition arn:aws:ecs:us-east-1:890742562318:task/dev-quest-cluster/b6f10651b1da4a96ba22189444d03313