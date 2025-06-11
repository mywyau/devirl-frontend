<script setup lang="ts">
import { useFetch } from 'nuxt/app'
import { onMounted, ref } from 'vue'

interface FileMeta {
    originalFilename: string
    s3ObjectKey: string
    uploadedAt: string
    size: number
}

const files = ref<FileMeta[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchFiles = async () => {
    try {
        const { data, error: fetchError } = await useFetch<FileMeta[]>('/api/files')

        if (fetchError.value) {
            throw fetchError.value
        }

        files.value = data.value ?? []
    } catch (err: any) {
        error.value = err.message ?? 'Error loading files'
    } finally {
        loading.value = false
    }
}

async function handleDownload(file: FileMeta) {
    try {
        const { data, error: presignError } = await useFetch<{ url: string }>('/s3/presign-download', {
            method: 'POST',
            body: { key: file.s3ObjectKey }
        })

        if (presignError.value || !data.value?.url) {
            throw new Error('Failed to get download URL')
        }

        const link = document.createElement('a')
        link.href = data.value.url
        link.download = file.originalFilename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (e) {
        console.error('Download failed:', e)
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
                        <th class="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="file in files" :key="file.s3ObjectKey" class="border-b border-white/5">
                        <td class="py-2 text-indigo-300">{{ file.originalFilename }}</td>
                        <td class="py-2 text-white">{{ (file.size / 1024).toFixed(1) }}</td>
                        <td class="py-2 text-white">{{ new Date(file.uploadedAt).toLocaleString() }}</td>
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
