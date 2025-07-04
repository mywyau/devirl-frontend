<script setup lang="ts">
import Input from '@/components/reka/Input.vue';
import { useAuthUser } from '@/composables/useAuthUser';
import { loadConfig } from '@/configuration/ConfigLoader';
import { Icon } from '@iconify/vue';
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`

const { data: user } = await useAuthUser()
const safeUserId = computed(() => user.value?.sub)

function roundUpTo2DP(value: number): number {
  return Math.ceil(value * 100) / 100
}

const platformFeePercent = 2.5 // e.g., 2.5%

const fee = computed(() => {
  return rewardAmount.value ? roundUpTo2DP(rewardAmount.value * (platformFeePercent / 100)) : 0
})

const totalToPay = computed(() => {
  return rewardAmount.value ? roundUpTo2DP(rewardAmount.value + fee.value) : 0
})

const route = useRoute();
const questIdFromRoute = route.params.id as string;
const questId = questIdFromRoute

const rewardAmount = ref<number>(0)
const success = ref(false)
const error = ref<string | null>(null)

async function submitReward() {
  if (rewardAmount.value < 0) {
    error.value = 'You cannot enter a negative monetary reward'
    return
  }

  try {
    const rewardCents = Math.round(rewardAmount.value * 100)

    await $fetch(`${baseUrl}reward/create/${encodeURIComponent(safeUserId.value)}`, {
      method: 'POST',
      credentials: "include",
      body: {
        questId: questId,
        rewardValue: rewardCents
      }
    })

    success.value = true
    error.value = null
  } catch (e: any) {
    error.value = 'Failed to save reward. Please try again.'
    console.error(e)
  }
}

const openPanels = ref<string[]>([]) // or [] to have them all closed initially

const accordionItems = [
  {
    value: 'item-1',
    title: 'How are rewards handled?',
    content: 'You can add a monetary reward to the quest. There will also be a platform fee of 2.5%.',
  },
  {
    value: 'item-2',
    title: 'What about Stripe fees?',
    content: 'Stripe also charges a fee for handling the payment securely.',
  },
  {
    value: 'item-3',
    title: 'Can I change the reward?',
    content: 'You cannot change or update the reward once the quest has been accepted by a developer.',
  },
  {
    value: 'item-4',
    title: 'When is payment made?',
    content: 'Payment will only be made when the quest is in review and you are happy to make payment. You can choose to pay either or both of these amounts to the developer',
  },
  {
    value: 'item-5',
    title: 'What is time reward?',
    content: 'This is amount you may pay to the developer for the time spend working on the quest',
  },
  {
    value: 'item-6',
    title: 'What is completion reward?',
    content: 'This is amount you may pay to the developer for completing the quest.',
  },
  {
    value: 'item-7',
    title: 'What is tracked?',
    content: 'We will track how often you payout for work being done. Combined with other metrics this is to help the community in determine trustworthiness and reliability. If the work is not being completed or your payout score is low this my hurt your reputation as a client. We suggest creating work and quests in achievable, smaller deliverable units.',
  },
]
</script>

<template>
  <NuxtLayout>

    <div class="max-w-xl mx-auto py-10 px-6 text-white">

      <div class="mb-6">
        <h1 class="text-3xl font-bold mb-6 text-green-300">Add Quest Reward</h1>

        <p v-if="success" class="mt-4 text-green-400 font-semibold">
          Reward saved successfully!
        </p>

        <div>
          <div class="mt-6 mb-6">
            <p class="mb-6">Please add a quest reward for the time worked on the quest.</p>

            <label for="reward" class="block text-base text-green-400 font-semibold mb-2">Time Reward ($)</label>
            <Input id="reward-amount" type="number" v-model="rewardAmount" placeholder="For example 20.00"
              class="w-1/3" />
            <p v-if="error" class="mt-4 text-red-400">{{ error }}</p>
          </div>

          <button @click="submitReward" class="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded">
            Add Reward
          </button>
        </div>

        <div>
          <div class="mt-6 mb-6">
            <p class="mt-4 mb-6">Please add a quest reward for completing the quest.</p>

            <label for="reward" class="block text-base text-green-400 font-semibold mt-2 mb-2">Completion Reward
              ($)</label>
            <Input id="reward-amount" type="number" v-model="rewardAmount" placeholder="For example 20.00"
              class="w-1/3" />
            <p v-if="error" class="mt-4 text-red-400">{{ error }}</p>
          </div>

          <div v-if="rewardAmount > 0" class="mt-4 mb-6 text-base text-zinc-300 space-y-">
            <p><strong>Developer Reward:</strong> ${{ rewardAmount.toFixed(2) }}</p>
            <p><strong>Platform Fee ({{ platformFeePercent }}%):</strong> ${{ fee.toFixed(2) }}</p>
            <p class="text-green-300 font-semibold">
              <strong>Total:</strong> ${{ totalToPay.toFixed(2) }}
            </p>
          </div>

          <button @click="submitReward" class="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded">
            Add Reward
          </button>
        </div>
      </div>

      <AccordionRoot class="rounded-lg border border-zinc-700 bg-zinc-900 mb-6" default-value="item-1" 
        v-if="openPanels"
        type="multiple" 
        :collapsible="true">
        <template v-for="item in accordionItems" :key="item.value">
          <AccordionItem
            class="mt-px overflow-hidden first:mt-0 first:rounded-t-lg last:rounded-b-lg border-b border-zinc-700 focus-within:relative focus-within:z-10 focus-within:ring-2 focus-within:ring-emerald-500"
            :value="item.value">
            <AccordionHeader class="flex">
              <AccordionTrigger
                class="flex h-[48px] flex-1 items-center justify-between px-4 text-sm font-semibold text-emerald-300 bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 group">
                <span>{{ item.title }}</span>
                <Icon icon="radix-icons:chevron-down"
                  class="text-emerald-300 transition-transform duration-300 group-data-[state=open]:rotate-180"
                  aria-label="Expand/Collapse" />
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent
              class="bg-zinc-800 text-zinc-300 text-sm data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
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
