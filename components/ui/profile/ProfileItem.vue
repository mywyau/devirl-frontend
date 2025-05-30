<script setup lang="ts">
defineProps<{
  label: string;
  value?: string;
  textColor?: string; // Tailwind class name, e.g., "text-white"
  labelColor?: string; // Tailwind class name, e.g., "text-white"
}>();
</script>

<template>
  <div class="flex justify-between border-b py-2">
    <span :class="labelColor ?? 'text-gray-600 font-medium'">{{ label }}</span>
    <span :class="textColor ?? 'text-gray-800 font-medium'">
      {{ value || "—" }}
    </span>
  </div>
</template>
