<script setup lang="ts">
import { onMounted, ref } from "vue";
import { loadConfig } from "@/configuration/ConfigLoader";

const config = loadConfig();
const jsonValue = ref<string | null>(null);

const url = `${config.devQuestBackend.baseUrl}/health`;

onMounted(async () => {
  try {
    console.debug("Calling health check:", url);

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    console.debug("Health check response:", data);

    jsonValue.value = data || "unknown"; 
  } catch (err) {
    console.error("Health check failed:", err);
    jsonValue.value = null;
  }
});
</script>


<template>
  <NuxtLayout>
    <div class="p-8 text-center">
      <h1 class="text-3xl font-bold">Backend Health Check</h1>
      <p class="mt-4 text-xl" v-if="jsonValue">Value: {{ jsonValue }}</p>
      <p class="mt-4 text-xl text-red-500" v-else>
        Loading or failed to fetch...
      </p>
    </div>
  </NuxtLayout>
</template>