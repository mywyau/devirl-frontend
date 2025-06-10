<template>
    <transition name="fade">
      <div
        v-if="!consentSet"
        class="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-50 bg-white/10 text-white border border-white/20 rounded-lg p-4 backdrop-blur shadow-lg"
      >
        <p class="mb-3">
          We use cookies and tracking tools to understand usage and improve your experience.
        </p>
        <div class="flex gap-4 justify-end">
          <button
            @click="setConsent(false)"
            class="px-4 py-2 text-sm bg-zinc-700 hover:bg-zinc-600 rounded"
          >
            Reject
          </button>
          <button
            @click="setConsent(true)"
            class="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded"
          >
            Accept
          </button>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  const consentSet = ref(false)
  
  onMounted(() => {
    const stored = localStorage.getItem('analytics_consent')
    consentSet.value = stored !== null
  })
  
  function setConsent(accepted: boolean) {
    localStorage.setItem('analytics_consent', accepted ? 'true' : 'false')
    consentSet.value = true
  
    // Optional: trigger analytics init here if accepted
    if (accepted) {
      // initAnalytics()
    }
  }
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  