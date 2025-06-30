<!-- components/reka/Textarea.vue -->
<script setup lang="ts">
defineProps<{
    modelValue: string
    placeholder?: string
    rows?: number
}>()

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <textarea :rows="rows || 6" :placeholder="placeholder" :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        class="font-sans w-full text-sm rounded border border-zinc-300 bg-white/90 px-4 py-2 text text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-400" />
</template>
