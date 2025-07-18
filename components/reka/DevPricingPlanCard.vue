<script setup lang="ts">

// ./components/reka/DevPricingPlanCard.vue

defineProps<{
  plan: {
    name: string
    price: string
    description: string
    maxActiveQuests: string
    devPool: string
    estimations: boolean
    rank: 'free' | 'mithril' | 'adamantite' | 'runic'
  }
}>();
</script>


<template>
  <div :class="[
    'rounded-2xl p-6 shadow-sm flex flex-col',
    {
      'bg-white': plan.rank === 'free',
      'bg-blue-200': plan.rank === 'mithril',
      'bg-green-200': plan.rank === 'adamantite',
      'bg-teal-200': plan.rank === 'runic'
    }
  ]">
    <h2 class="text-2xl font-semibold mb-1">{{ plan.name }}</h2>
    <p class="text-gray-600 mb-4">{{ plan.description }}</p>
    <p class="text-3xl font-bold text-indigo-600 mb-6">{{ plan.price }}</p>

    <ul class="space-y-2 text-sm text-gray-700 flex-1">
      <li>📌 Max Active Quests: <strong>{{ plan.maxActiveQuests }}</strong></li>
      <li>🔍 Number of Quests Access: <strong>{{ plan.devPool }}</strong></li>
    </ul>

    <button class="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl transition">
      {{ plan.name }}
    </button>
  </div>
</template>
