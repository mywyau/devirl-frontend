<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    console.error('Payment failed or was cancelled')
})

</script>


<template>
    <NuxtLayout>
        <div class="min-h-screen flex items-center justify-center p-6 text-center">
            <div>
                <h1 class="text-white text-3xl font-bold text-green-600 mb-4">
                    Payment <span class="text-red-400">Unsuccessful</span>
                </h1>

                <p class="text-white mb-6">
                    The payment was possibly cancelled or failed unexpectedly. Please try again.
                </p>

                <a :href="`/`" rel="external">
                    <Button variant="secondary"
                        class="bg-teal-500 text-white rounded hover:bg-teal-400 px-4 py-2 text-sm mt-4">
                        Return Home
                    </Button>
                </a>
            </div>
        </div>
    </NuxtLayout>
</template>