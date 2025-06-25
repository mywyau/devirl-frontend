<script setup lang="ts">
import { useAuthUser } from '@/composables/useAuthUser';
import { computed, onMounted } from 'vue';


const { data: user } = await useAuthUser();
const safeUserId = computed(() => user.value?.sub || "");

// Optionally, trigger backend call to update Stripe account status

onMounted(async () => {
    // const user = await $fetch('/api/session') // or use composable if you have Auth
    if (safeUserId) {
        await $fetch(`backend/stripe/onboarding/complete/${encodeURIComponent(safeUserId.value)}`, { method: 'POST' })
    }
})

</script>

<template>
    <NuxtLayout>
        <div class="p-6 text-center">
            <h1 class="text-white text-2xl font-bold mb-4">Stripe Onboarding Complete</h1>
            <p class="text-green-500 mb-6">Your Stripe account has been set up. You can now receive payouts.</p>
            <NuxtLink to="/" class="text-teal-500 underline">Continue</NuxtLink>
        </div>
    </NuxtLayout>
</template>
