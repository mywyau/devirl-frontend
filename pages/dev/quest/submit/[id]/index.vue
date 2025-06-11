<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { getQuest } from "@/controllers/QuestBackendController";
import { uploadUrl } from "@/controllers/UploadController";
import { useAsyncData, useRoute } from "nuxt/app";
import { computed, ref } from "vue";

// 1) Grab the route param
const route = useRoute();
const questIdFromRoute = route.params.id as string;

// 2) Resolve the logged‐in user (SSR will forward the cookie via useAuthUser)
const { data: user } = await useAuthUser();
const devIdFromSession = computed(() => user.value?.sub || "");

const file = ref<File | null>(null);
const status = ref("");

const fileExtension = computed(() => {
  if (!file.value?.name) return "Unknown";
  const match = file.value.name.toLowerCase().match(/\.[0-9a-z]+$/i);
  return match ? match[0] : "No extension";
});

// 3) Fetch quest data via useAsyncData (runs on server, then hydrates)
const {
  data: rawQuestData,
  pending,
  error: fetchError,
} = await useAsyncData(
  `quest-${questIdFromRoute}`,
  () => getQuest(devIdFromSession.value, questIdFromRoute),
  {
    server: true, // run on server only
    default: () => null,
  }
);

// Temporary hardcoded metadata – you can fetch these dynamically later
const clientId = rawQuestData.value?.clientId || "No client Id found from backend"
const devId = devIdFromSession.value
const questId = questIdFromRoute

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  file.value = target.files?.[0] || null;
  status.value = "";
}

function formatSize(size: number): string {
  return (size / 1024).toFixed(2) + " KB";
}

async function uploadFile() {
  if (!file.value) return;

  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("clientId", clientId);
  formData.append("devId", devId);
  formData.append("questId", questId);

  try {
    const res = await fetch(uploadUrl(), {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload failed");
    }

    const data = await res.json();
    status.value = `Uploaded: ${file.value.name} → Key: ${data.key}`;
  } catch (error: any) {
    status.value = `Error: ${error.message}`;
  }
}
</script>

<style scoped>
input[type="file"] {
  display: block;
}
</style>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-md mx-auto rounded-xl space-y-4">

      <h1 class="text-3xl font-bold text-teal-200">Upload a File</h1>

      <p class="text-xl font-bold text-teal-400/80">{{ rawQuestData?.title }}</p>

      <p class="text-base text-teal-300/80">{{ rawQuestData?.description }}</p>

      <input class="text-white pt-4" type="file" @change="handleFileChange" />

      <div v-if="file" class="text-white mt-4 space-y-2">
        <p><strong>Name:</strong> {{ file.name }}</p>
        <p><strong>Size:</strong> {{ formatSize(file.size) }}</p>
        <p><strong>Extension:</strong> {{ fileExtension }}</p>

        <button 
          class="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 disabled:opacity-50" @click="uploadFile">
          Upload
        </button>
      </div>

      <p v-if="status" class="text-sm mt-2 text-green-600">{{ status }}</p>
    </div>
  </NuxtLayout>
</template>
