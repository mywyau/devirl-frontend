<script setup lang="ts">
import { useToast } from '@/composables/useToast';
const { toasts } = useToast()
</script>

<template>
    <div class="fixed top-5 right-5 flex flex-col gap-3">
        <div v-for="t in toasts" :key="t.id" class="bg-gray-900 text-white p-3 rounded shadow-lg">
            <strong>{{ t.title }}</strong>
            <p>{{ t.message }}</p>
        </div>
    </div>
</template>
