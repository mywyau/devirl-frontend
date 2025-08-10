<script setup lang="ts">
import PricingPlanCard from "@/components/reka/ClientPricingPlanCard.vue";

type Tier = 'free' | 'starter' | 'growth' | 'scale'

type Plan = {
  name: string
  tier: Tier
  price: string
  description: string
  maxActiveQuests: string
  devPool: string
  estimations: boolean
  ctaLabel?: string,
  canCustomizeLevelThresholds: boolean
  boostQuests: boolean
}

const plans: Plan[] = [
  {
    name: "Free",
    tier: "free",
    price: "$0",
    description: "Get started and try the platform.",
    maxActiveQuests: "2",
    devPool: "Auto‑match only",
    estimations: true,
    ctaLabel: "Get started",
    canCustomizeLevelThresholds: false,
    boostQuests: false
  },
  {
    name: "Starter",
    tier: "starter",
    price: "$20/mo",
    description: "For occasional hiring and smaller projects.",
    maxActiveQuests: "5",
    devPool: "Invite and assign specific developers",
    estimations: true,
    canCustomizeLevelThresholds: false,
    boostQuests: false,
  },
  {
    name: "Growth",
    tier: "growth",
    price: "$50/mo",
    description: "For teams scaling delivery with more control.",
    maxActiveQuests: "20",
    devPool: "Invite and assign specific developers",
    estimations: true,
    canCustomizeLevelThresholds: true,
    boostQuests: true,
  },
  {
    name: "Scale",
    tier: "scale",
    price: "$100/mo",
    description: "High‑volume hiring, advanced controls & support.",
    maxActiveQuests: "Unlimited",
    devPool: "Invite and assign specific developers",
    estimations: true,
    canCustomizeLevelThresholds: true,
    boostQuests: true,
  }
];
</script>

<template>
  <NuxtLayout>
    <section class="max-w-7xl mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold text-center mb-4 text-black dark:text-white">Pricing</h1>
      <p class="text-center text-black dark:text-white mb-12">
        Choose the plan that fits your workflow and growth stage.
      </p>

      <div class="grid md:grid-cols-4 gap-6">
        <PricingPlanCard v-for="plan in plans" :key="plan.name" :plan="plan" />
      </div>
    </section>
  </NuxtLayout>
</template>
