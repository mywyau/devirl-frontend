<script setup lang="ts">
// ./components/reka/ClientPricingPlanCard.vue

type Tier = 'free' | 'starter' | 'growth' | 'scale'

defineProps<{
  plan: {
    name: string
    price: string            // e.g. "£0", "£79/mo"
    description: string
    maxActiveQuests: string  // e.g. "3", "10", "Unlimited"
    devPool: string          // e.g. "Invite & shortlist", "Auto‑match only"
    estimations: boolean     // Custom estimation controls
    customiseableEstimations: boolean     // Custom estimation controls
    tier: Tier               // 'free' | 'starter' | 'growth' | 'scale'
    ctaLabel?: string        // Optional: override button text
    canCustomizeLevelThresholds?: boolean
    boostQuests: boolean
  }
}>()
</script>

<template>
  <section :class="[
    'rounded-lg p-6 shadow-sm flex flex-col border text-black',
    // Light, neutral backgrounds with solid contrast
    plan.tier === 'free' ? 'bg-white border-gray-400 dark:border-gray-100' : '',
    plan.tier === 'starter' ? 'bg-slate-100 border-slate-400 dark:border-slate-100' : '',
    plan.tier === 'growth' ? 'bg-indigo-100 border-indigo-400 dark:border-indigo-100' : '',
    plan.tier === 'scale' ? 'bg-violet-100 border-violet-400 dark:border-violet-100' : ''
  ]" role="region" :aria-labelledby="`${plan.tier}-title`">

    <h2 :id="`${plan.tier}-title`" class="text-black text-2xl font-semibold mb-1">
      {{ plan.name }}
    </h2>

    <p class="text-slate-600 mb-4">
      {{ plan.description }}
    </p>

    <p class="text-3xl font-bold text-slate-900 mb-6">
      {{ plan.price }}
      <span class="sr-only">Price</span>
    </p>

    <ul class="space-y-3 text-sm text-slate-800 flex-1">

      <li class="flex items-start gap-2">
        <span aria-hidden="true">📌</span>
        <span>
          <span class="font-medium">Active quests</span> — <strong>{{ plan.maxActiveQuests }}</strong>
        </span>
      </li>

      <li v-if="plan.estimations" class="flex items-start gap-2">
        <span aria-hidden="true">🧮</span>
        <span class="flex-1">
          <span class="font-medium">Community estimations</span>
        </span>
      </li>

      <li class="flex items-start gap-2">
        <span aria-hidden="true">🎯</span>
        <span>
          <span class="font-medium">{{ plan.devPool }}</span>
        </span>
      </li>

      <li v-if="plan.customiseableEstimations" class="flex items-start gap-2">
        <span aria-hidden="true">🧮</span>
        <span class="flex-1">
          <span class="font-medium">Customisable estimations</span>
        </span>
      </li>

      <li v-if="plan.boostQuests" class="flex items-start gap-2">
        <span aria-hidden="true">🧮</span>
        <span class="flex-1">
          <span class="font-medium">Boost Quests</span>
        </span>
      </li>

      <li v-if="plan.canCustomizeLevelThresholds" class="flex items-start gap-2">
        <span aria-hidden="true">🧱</span>
        <span class="flex-1">
          <span class="font-medium">Customisable minimum dev level thresholds</span>
        </span>
      </li>
    </ul>

    <button
      class="mt-6 w-full py-2 px-4 rounded-lg transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
      :class="[
        plan.tier === 'free' ? 'bg-slate-900 text-white hover:bg-black focus:ring-slate-900' : '',
        plan.tier === 'starter' ? 'bg-slate-900 text-white hover:bg-black focus:ring-slate-900' : '',
        plan.tier === 'growth' ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600' : '',
        plan.tier === 'scale' ? 'bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-600' : ''
      ]">
      {{ plan.ctaLabel ?? (plan.tier === 'free' ? 'Get started' : 'Choose plan') }}
    </button>
  </section>
</template>
