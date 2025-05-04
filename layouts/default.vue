<template>
  <div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-gray-100 font-sans">
    <header class="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
      <NuxtLink to="/" class="text-xl font-bold text-white hover:text-gray-300">
        Dev Irl
      </NuxtLink>

      <nav class="space-x-6 flex items-center">
        <template v-if="user">
          <span class="text-sm text-white/70">Hi, {{ user.name }}</span>
        </template>

        <NuxtLink to="/quests" class="hover:text-gray-300">Quests</NuxtLink>
        <NuxtLink to="/quests/new" class="hover:text-gray-300">Post Quest</NuxtLink>

        <template v-if="user">
          <NuxtLink to="/quest-dashboard" class="hover:text-gray-300">Quest Dashboard</NuxtLink>
          <button @click="logout" class="hover:text-red-400 text-base">Logout</button>
        </template>

        <template v-else>
          <a
            :href="loginUrl"
            class="hover:text-cyan-400 text-base"
          >
            Login
          </a>
        </template>
      </nav>
    </header>

    <main class="p-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from '#app'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig().public 

const { data: user } = await useFetch('/api/auth/session', {
  credentials: 'include',
})

const callbackUrl = process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL
// const loginUrl = `https://${process.env.NUXT_PUBLIC_AUTH0_DOMAIN}/authorize?response_type=code&client_id=${process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID}&redirect_uri=${process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL}`
// const loginUrl = `https://${config.auth0Domain}/authorize?response_type=code&client_id=${config.auth0ClientId}&redirect_uri=${config.auth0CallbackUrl}`

const loginUrl = `https://dev-3cz1mwtxetvjzpjg.uk.auth0.com/authorize?response_type=code&client_id=fv24N4KfQC7bFpGrI50Ax9dVdaDwOtuN&redirect_uri=http://localhost:3000/api/auth/callback`


console.log('[Auth] Callback URL:', callbackUrl)
console.log('[Auth] Login URL:', loginUrl)

const logout = async () => {
  await fetch('/api/auth/logout', { credentials: 'include' })
  window.location.href = '/'
}
</script>
