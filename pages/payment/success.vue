<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    // Optional: trigger any backend logic or refresh state
    console.log('Payment successful')
})
</script>

<template>
    <NuxtLayout>
        <div class="p-6 text-center">
            <h1 class="text-white text-3xl font-bold text-green-600 mb-4">Payment Successful</h1>
            <p class="text-green-500 mb-6">Thanks for your payment!</p>
            <NuxtLink to="/" class="text-teal-500 underline">Return to Home</NuxtLink>
        </div>
    </NuxtLayout>
</template>
