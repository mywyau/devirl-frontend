<script setup lang="ts">
import { ref } from "vue";

const file = ref<File | null>(null);
const status = ref("");

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  file.value = target.files?.[0] || null;
  status.value = "";
}

function formatSize(size: number): string {
  return (size / 1024).toFixed(2) + " KB";
}

async function mockUpload() {
  if (!file.value) return;

  console.log("Uploading file:", file.value.name);

  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // You can replace this block with your actual upload logic:
  // const formData = new FormData()
  // formData.append('file', file.value)
  // await $fetch('/api/upload', { method: 'POST', body: formData })

  status.value = `Successfully uploaded ${file.value.name}`;
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
      <h1 class="text-xl font-bold">Upload a File</h1>

      <input type="file" @change="handleFileChange" />

      <div v-if="file" class="mt-4 space-y-2">
        <p><strong>Name:</strong> {{ file.name }}</p>
        <p><strong>Size:</strong> {{ formatSize(file.size) }}</p>

        <button
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          @click="mockUpload"
        >
          Upload
        </button>
      </div>

      <p v-if="status" class="text-sm mt-2 text-green-600">{{ status }}</p>
    </div>
  </NuxtLayout>
</template>
