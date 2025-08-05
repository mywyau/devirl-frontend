<script setup lang="ts">
const props = defineProps<{
    id: string;
    hasLoaded: boolean;
    totalItems: number;
}>();
</script>

<template>
    <p :id="id" v-if="hasLoaded" class="text-center w-full text-white mb-10">
        There {{ totalItems === 1 ? 'is' : 'are' }}
        <span class="text-teal-300 font-bold">{{ totalItems }}</span>
        developer{{ totalItems === 1 ? '' : 's' }}
    </p>
</template>
