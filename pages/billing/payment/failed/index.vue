<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const sessionId = route.query.session_id as string
const plan = route.query.plan as string

// Optionally call your backend to confirm the Checkout Session with sessionId
</script>

<template>
  <div>
    <h1>Payment Failed!</h1>
    <p>You did not subscribe to {{ plan }}</p>
    <p>Your plan remains the same</p>
  </div>
</template>
