<script setup>
const auth = useAuth()
const user = ref(null)

onMounted(async () => {
  if (await auth.isAuthenticated()) {
    user.value = await auth.getUser()
  }
})
</script>

<template>
  <div>
    <div v-if="user">
      👋 Welcome, {{ user.name }}
      <button @click="auth.logout()">Logout</button>
    </div>
    <div v-else>
      <button @click="auth.login()">Login</button>
    </div>
  </div>
</template>
