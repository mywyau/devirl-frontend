<script setup lang="ts">
import { createPreSignedDownloadUrl, getFileMetaData } from '@/controllers/UploadController'
import { useRoute } from 'nuxt/app'
import { onMounted, ref } from 'vue'

interface DevSubmissionMetadata {
  clientId: string;
  devId: string;
  questId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3ObjectKey: string;
  bucketName: string;
}


const files = ref<DevSubmissionMetadata[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const route = useRoute();
const questIdFromRoute = route.params.id as string;

const fetchFiles = async () => {
  try {
    const data = await getFileMetaData(questIdFromRoute); // returns DevSubmissionMetadata[] array
    files.value = Array.isArray(data) ? data : [data]; // fallback if it’s a single object
  } catch (err: any) {
    error.value = err.message ?? 'Error loading files';
  } finally {
    loading.value = false;
  }
};



async function handleDownload(file: DevSubmissionMetadata) {
    try {
        const { url } = await createPreSignedDownloadUrl(file.s3ObjectKey);

        const link = document.createElement('a');
        link.href = url;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.error('Download failed:', e);
        error.value = 'Failed to download file';
    }
}



onMounted(fetchFiles)

</script>

<template>
    <NuxtLayout>
        <div class="max-w-4xl mx-auto p-6">
            <h1 class="text-3xl font-bold mb-4 text-lime-400">Files Uploaded</h1>

            <p class="text-lime-200/80 pb-4">You can download files uploaded by the dev here :)</p>

            <div v-if="loading" class="text-gray-400">Loading files...</div>
            <div v-else-if="error" class="text-red-500">{{ error }}</div>
            <div v-else-if="!files.length" class="text-gray-400">No files uploaded yet.</div>

            <table v-else class="w-full table-auto text-left border-collapse">
                <thead>
                    <tr class="border-b border-white/10 text-white">
                        <th class="py-2">Filename</th>
                        <th class="py-2">Size (KB)</th>
                        <th class="py-2">Uploaded</th>
                        <!-- <th class="py-2">Actions</th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="file in files" :key="file.s3ObjectKey" class="border-b border-white/5">
                        <td class="py-2 text-indigo-300">{{ file.fileName }}</td>
                        <td class="py-2 text-white">{{ (file.fileSize / 1024).toFixed(1) }}</td>
                        <!-- <td class="py-2 text-white">{{ new Date(file.uploadedAt).toLocaleString() }}</td> -->
                        <td class="py-2">
                            <button class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                @click="handleDownload(file)">
                                Download
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </NuxtLayout>
</template>
