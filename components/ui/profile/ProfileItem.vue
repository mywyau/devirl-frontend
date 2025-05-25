<script setup lang="ts">
defineProps<{
  label: string
  value?: string
  textColor?: string // Tailwind class name, e.g., "text-white"
}>()
</script>

<template>
  <div class="flex justify-between border-b py-2">
    <span class="font-medium text-gray-600">{{ label }}</span>
    <span :class="textColor ?? 'text-gray-800'">
      {{ value || '—' }}
    </span>
  </div>
</template>
