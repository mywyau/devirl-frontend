<template>
  <NuxtLayout>
    <div class="p-6 max-w-5xl mx-auto text-white">
      <h1 class="text-3xl font-bold mb-8 capitalize">
        Dashboard
      </h1>

      <!-- Navigation Links -->
      <div class="mb-6 space-x-4">
        <NuxtLink to="/quest-dashboard/in-progress" class="text-blue-400 hover:underline">In Progress</NuxtLink>
        <NuxtLink to="/quest-dashboard/submitted" class="text-blue-400 hover:underline">Submitted</NuxtLink>
        <NuxtLink to="/quest-dashboard/completed" class="text-blue-400 hover:underline">Completed</NuxtLink>
        <NuxtLink to="/quest-dashboard/failed" class="text-blue-400 hover:underline">Failed</NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>


<script setup lang="ts">
const route = useRoute();

</script>
