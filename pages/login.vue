<!-- components/AuthButtons.vue -->
<template>
    <div v-if="!isAuthenticated">
      <button @click="loginWithRedirect">Login</button>
    </div>
    <div v-else>
      <p>Welcome, {{ user?.name }}</p>
      <button @click="logout({ returnTo: window.location.origin })">Logout</button>
    </div>
  </template>
  
  <script setup>
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0()
  </script>
  