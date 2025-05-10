<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8"
  >
    <div class="max-w-md w-full space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center">
        🎉 Welcome, {{ user?.name || "Guest" }}!
      </h1>

      <p class="text-center text-gray-400">You've successfully logged in.</p>

      <div v-if="user" class="text-center space-y-2">
        <img
          :src="user.picture"
          alt="Profile Picture"
          class="w-20 h-20 mx-auto rounded-full shadow"
        />
        <p>{{ user.email }}</p>
      </div>

      <NuxtLink
        to="/"
        class="block w-full text-center mt-4 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-md"
      >
        Go to Dashboard
      </NuxtLink>
    </div>
  </div>
</template>


<script setup lang="ts">

definePageMeta({ ssr: false })

import { useFetch } from 'nuxt/app'
import { AuthController } from '~/controllers/AuthController'

const auth = new AuthController()

// Grab the user’s sub from your AuthController
const { data: user, error: sessionError } = await auth.sessionRequest()
if (sessionError.value) {
  console.error('Failed to fetch session from AuthController:', sessionError.value)
}

// If we have a sub, POST it to your proxy
if (user.value?.sub) {
  const { data: proxyData, error: proxyError } = await useFetch('/api/proxy/session', {
    method:      'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: { sub: user.value.sub }
  })

  if (proxyError.value) {
    console.error('Proxy session request failed:', proxyError.value)
  } else {
    // proxyData.value now contains whatever your /api/proxy/session returned
    console.log('Session write result:', proxyData.value)
  }
}
</script>
