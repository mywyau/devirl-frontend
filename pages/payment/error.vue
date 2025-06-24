<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    console.error('Payment failed or was cancelled')
})
</script>

<template>
    <NuxtLayout>
        <div class="p-6 text-center">
            <h1 class="text-white text-3xl font-bold text-red-600 mb-4">Error</h1>
            <p class="text-red-500 mb-6">
                Payment Cancelled or Failed
            </p>

            <p class="text-red-500 mb-6">
                Your payment was not completed. You can try again.
            </p>

            <NuxtLink to="/" class="text-teal-500 underline">Return to Home</NuxtLink>
        </div>
    </NuxtLayout>
</template>
