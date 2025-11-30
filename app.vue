<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

onMounted(() => {
  useNotifications()
})

</script>

<template>
  <NuxtPage />
  <ToastDisplay />
</template>
