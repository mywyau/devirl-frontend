<script setup lang="ts">
type Tier = 'free' | 'freelancer' | 'pro' | ''

defineProps<{
  plan: {
    name: string
    price: string
    description: string
    maxConcurrentQuests: string
    tier: Tier
    ctaLabel?: string
    showOnLeaderBoard: boolean
    communicateWithClient: boolean
  }
}>()
</script>

<template>
  <section
    :class="[
      'h-full flex flex-col rounded-lg p-6 shadow-sm border text-black',
      plan.tier === 'free'        ? 'bg-white dark:border-gray-200'      : '',
      plan.tier === 'freelancer'  ? 'bg-slate-100 dark:border-slate-300' : '',
      plan.tier === 'pro'         ? 'bg-slate-100 dark:border-slate-300' : '',
    ]"
    role="region"
    :aria-labelledby="`${plan.tier}-title`"
  >
    <!-- 1) Header: reserve consistent space so price aligns across cards -->
    <div class="mb-4 min-h-[84px]"> <!-- tweak 84px to your design -->
      <h2 :id="`${plan.tier}-title`" class="text-black text-2xl font-semibold mb-1">
        {{ plan.name }}
      </h2>
      <!-- Two-line clamp + reserved height -->
      <p class="text-slate-600 min-h-[3.5rem] line-clamp-2">
        {{ plan.description }}
      </p>
    </div>

    <!-- 2) Price: give it a small fixed height so the next section starts aligned -->
    <div class="mb-6 min-h-[2.5rem] flex items-end">
      <p class="text-3xl font-bold text-slate-900 leading-none">
        {{ plan.price }}
        <span class="sr-only">Price</span>
      </p>
    </div>

    <!-- 3) Features: normal top margin (NO mt-auto) so it sits right under price -->
    <ul class="mt-2 space-y-3 text-sm text-slate-800">
      <li class="flex items-start gap-2">
        <span aria-hidden="true">📌</span>
        <span>
          <span class="font-medium">Active quests</span> — <strong>{{ plan.maxConcurrentQuests }}</strong>
        </span>
      </li>

      <li v-if="plan.showOnLeaderBoard" class="flex items-start gap-2">
        <span aria-hidden="true">🧮</span>
        <span class="flex-1">
          <span class="font-medium">Appear on the Hiscores</span>
        </span>
      </li>

      <li v-if="plan.communicateWithClient" class="flex items-start gap-2">
        <span aria-hidden="true">💬</span>
        <span class="flex-1">
          <span class="font-medium">Communicate with clients during quests</span>
        </span>
      </li>
    </ul>

    <!-- Optional: spacer at the very end to keep cards equal height if needed -->
    <div class="mt-auto"></div>
  </section>
</template>
