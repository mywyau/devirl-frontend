<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'

defineProps<{
    type?: string
    placeholder?: string
    modelValue: string | number
}>()

defineEmits(['update:modelValue'])
</script>

<template>
    <Primitive as="input" :type="type || 'text'" :placeholder="placeholder" :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="w-full text-sm px-4 py-2 bg-white text-black border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-teal-400" />
</template>
