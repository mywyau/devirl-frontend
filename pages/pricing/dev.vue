<script setup lang="ts">

import PricingPlanCard from "@/components/reka/DevPricingPlanCard.vue";

const plans = [
  {
    name: "Free Trial",
    rank: "free",
    price: "$0",
    description: "14-day free trial for new clients",
    maxActiveQuests: "2",
    devPool: "Random Dev",
    estimations: true,
    silverHighlight: false,
    goldHighlight: false
  },
  {
    name: "Mithril",
    rank: "mithril",
    price: "$20/mo",
    description: "Starter plan for small teams",
    maxActiveQuests: "10",
    devPool: "Random Dev",
    estimations: true,
    silverHighlight: false,
    goldHighlight: false
  },
  {
    name: "Adamantite",
    rank: "adamantite",
    price: "$50/mo",
    description: "Growth plan for scaling teams",
    maxActiveQuests: "20",
    devPool: "Choose Dev Level",
    estimations: true,
    silverHighlight: true,
    goldHighlight: false
  },
  {
    name: "Runic",
    rank: "runic",
    price: "$100/mo",
    description: "For high-volume teams needing premium support",
    maxActiveQuests: "Unlimited",
    devPool: "Set Dev Level and Request Developers",
    estimations: true,
    silverHighlight: true,
    goldHighlight: false
  }
];
</script>


<template>
  <NuxtLayout>
    <section class="max-w-7xl mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-center mb-4 text-white">Pricing Plans</h1>
      <p class="text-center text-gray-500 mb-12 text-white">Choose the plan that fits your workflow and growth stage.
      </p>

      <div class="grid md:grid-cols-4 gap-6">
        <PricingPlanCard v-for="plan in plans" :key="plan.name" :plan="plan" />
      </div>
    </section>
  </NuxtLayout>
</template>
