<script setup lang="ts">
import { Button } from "@/components/ui/button/variants";
import { onMounted } from 'vue';

onMounted(() => {
    // Optional: trigger any backend logic or refresh state
    console.log('Payment successful')
})
</script>

<template>
    <NuxtLayout>
        <div class="min-h-screen flex items-center justify-center p-6 text-center">
            <div>
                <h1 class="text-white text-3xl font-bold text-green-600 mb-4">
                    Payment <span class="text-green-400">Successful</span>
                </h1>

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
