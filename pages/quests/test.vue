<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { onMounted, ref } from "vue";

const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } =
  useAuth0();

const quests = ref([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    if (!isAuthenticated.value) {
      await loginWithRedirect();
      return;
    }

    const token = await getAccessTokenSilently();

    const res = await fetch(
      "https://api.devirl.com/dev-quest-service/quest/quest001",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    quests.value = await res.json();
  } catch (err: any) {
    error.value = err.message || "Unexpected error";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Your Quests</h1>

    <div v-if="loading">Loading quests...</div>
    <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>
    <ul v-else>
      <li v-for="quest in quests" :key="quest.id" class="mb-2">
        {{ quest.name }}
      </li>
    </ul>
  </div>
</template>
