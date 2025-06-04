<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const code = route.query.code

  if (!code || typeof code !== 'string') {
    console.error('Missing code')
    return
  }

  try {
    const { redirectUrl } = await $fetch('/api/auth/callback', {
      params: { code },
      credentials: 'include',
    })

    if (redirectUrl) {
      await router.push(redirectUrl)
    } else {
      console.warn('No redirect URL returned, falling back to home')
      await router.push('/')
    }
  } catch (err) {
    console.error('Auth callback failed:', err)
    await router.push('/error')
  }
})
</script>


<template>
  <div class="flex items-center justify-center h-screen">
    <p>Logging you in...</p>
  </div>
</template>
