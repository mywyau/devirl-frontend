<script setup lang="ts">
import { Icon } from '@iconify/vue'
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from 'reka-ui'

const faqItems = [
  {
    value: 'about',
    title: 'About',
    content:
      'Dev IRL is a platform where developers complete real-world "quests" to learn, grow, and get noticed. Think of it as RPG-style coding for real-world impact.',
  },
  {
    value: 'quest-creation',
    title: 'Quest Creation',
    content:
      'Click "Create Quest", fill in the required fields, and submit. It’ll go live and people can estimate and leave comments.',
  },
  {
    value: 'ranks',
    title: 'Ranks',
    content:
      'Ranks range from Bronze to Aether to indicate difficulty — Bronze being beginner-friendly, and Aether being elite-level challenges.',
  },
]
</script>

<template>
  <NuxtLayout>
    <div class="mx-auto max-w-3xl px-6 py-12 text-white">
      <h1 class="text-3xl font-bold mb-8 text-green-300">Frequently Asked Questions</h1>

      <AccordionRoot
        class="rounded-lg border border-zinc-700 bg-zinc-900"
        default-value="about"
        type="single"
        :collapsible="true"
      >
        <template v-for="item in faqItems" :key="item.value">
          <AccordionItem
            class="mt-px overflow-hidden first:mt-0 first:rounded-t-lg last:rounded-b-lg border-b border-zinc-700 focus-within:relative focus-within:z-10 focus-within:ring-2 focus-within:ring-emerald-500"
            :value="item.value"
          >
            <AccordionHeader class="flex">
              <AccordionTrigger
                class="flex h-[48px] flex-1 items-center justify-between px-4 text-sm font-semibold text-emerald-300 bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 group"
              >
                <span>{{ item.title }}</span>
                <Icon
                  icon="radix-icons:chevron-down"
                  class="text-emerald-300 transition-transform duration-300 group-data-[state=open]:rotate-180"
                  aria-label="Expand/Collapse"
                />
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent
              class="bg-zinc-800 text-zinc-300 text-sm data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden"
            >
              <div class="px-4 py-3">
                {{ item.content }}
              </div>
            </AccordionContent>
          </AccordionItem>
        </template>
      </AccordionRoot>
    </div>
  </NuxtLayout>
</template>
