<script setup lang="ts">
import { Primitive } from 'reka-ui';

defineProps<{
  type?: 'text' | 'number'
  placeholder?: string
  modelValue: string | number
}>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>

<template>
  <Primitive as="input" :type="type || 'text'" :placeholder="placeholder" :value="modelValue" @input="
    $emit(
      'update:modelValue',
      type === 'number'
        ? ($event.target as HTMLInputElement).valueAsNumber
        : ($event.target as HTMLInputElement).value
    )
    " v-bind="$attrs"
    class="text-sm px-4 py-2 bg-white text-black border border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-teal-400" />
</template>
