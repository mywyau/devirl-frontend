<script setup lang="ts">

// pages/billing/payment/successful/index.vue

import { useRoute } from 'vue-router'

const route = useRoute()
const sessionId = route.query.session_id as string
const plan = route.query.plan as string

// Optionally call your backend to confirm the Checkout Session with sessionId
</script>

<template>
  <div>
    <h1>Payment Successful!</h1>
    <p>You subscribed to {{ plan }}</p>
  </div>
</template>
