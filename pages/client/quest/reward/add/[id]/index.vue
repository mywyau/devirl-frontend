<script setup lang="ts">
import Input from '@/components/reka/Input.vue';
import { useAuthUser } from '@/composables/useAuthUser';
import { loadConfig } from '@/configuration/ConfigLoader';
import { Icon } from '@iconify/vue';
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const questIdFromRoute = route.params.id as string;
const questId = questIdFromRoute

const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`

const { data: user } = await useAuthUser()
const safeUserId = computed(() => user.value?.sub)

function roundUpTo2DP(value: number): number {
  return Math.ceil(value * 100) / 100
}

const platformFeePercent = 2.5 // e.g., 2.5%

const completionRewardAmount = ref<number>(0)
const completionSuccess = ref(false)
const completionError = ref<string | null>(null)

const timeRewardAmount = ref<number>(0)
const timeSuccess = ref(false)
const timeError = ref<string | null>(null)

const timeOnlyFee = computed(() => {
  return timeRewardAmount.value ? roundUpTo2DP(timeRewardAmount.value * (platformFeePercent / 100)) : 0
})

const completionOnlyFee = computed(() => {
  return completionRewardAmount.value ? roundUpTo2DP(completionRewardAmount.value * (platformFeePercent / 100)) : 0
})

const timeAndCompletionfee = computed(() => {
  return completionRewardAmount.value + timeRewardAmount.value ? roundUpTo2DP((completionRewardAmount.value + timeRewardAmount.value) * (platformFeePercent / 100)) : 0
})


const totalToPay = computed(() => {
  const devReward = timeRewardAmount.value + completionRewardAmount.value
  const fee = timeAndCompletionfee.value
  return devReward ? roundUpTo2DP(devReward + fee) : 0
})

async function submitCompletionReward() {

  if (timeRewardAmount.value < 0) {
    timeError.value = 'You cannot enter a negative monetary reward value'
    return
  }

  if (completionRewardAmount.value < 0) {
    completionError.value = 'You cannot enter a negative monetary reward value'
    return
  }

  try {

    const timeRewardCents = Math.round(timeRewardAmount.value * 100)
    const completionRewardCents = Math.round(completionRewardAmount.value * 100)

    await $fetch(`${baseUrl}reward/create/${encodeURIComponent(safeUserId.value)}`, {
      method: 'POST',
      credentials: "include",
      body: {
        questId: questId,
        timeRewardValue: timeRewardCents,
        completionRewardValue: completionRewardCents
      }
    })

    completionSuccess.value = true
    completionError.value = null

    timeSuccess.value = true
    timeError.value = null

  } catch (e: any) {
    timeError.value = 'Failed to save time reward. Please try again.'
    completionError.value = 'Failed to save completion reward. Please try again.'
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

        <p v-if="completionSuccess && timeSuccess" class="mt-4 text-green-400 font-semibold">
          All Rewards Saved Successfully!
        </p>

        <p v-else-if="completionSuccess" class="mt-4 text-green-400 font-semibold">
          Completion Reward Saved Successfully!
        </p>

        <p v-else-if="timeSuccess" class="mt-4 text-green-400 font-semibold">
          Time Reward Saved Successfully!
        </p>

        <div>
          <div class="mt-6 mb-6">
            <p class="mb-6">Please add a quest reward for the time worked on the quest.</p>

            <label for="time-reward-amount" class="block text-base text-green-400 font-semibold mb-2">Time Reward
              ($)</label>
            <Input id="time-reward-amount" type="number" v-model="timeRewardAmount" placeholder="For example 20.00"
              class="w-1/3" />
            <p v-if="timeError" class="mt-4 text-red-400">{{ timeError }}</p>
          </div>
        </div>

        <div>
          <div class="mt-6 mb-6">
            <p class="mt-4 mb-6">Please add a quest reward for completing the quest.</p>

            <label for="completion-reward-amount"
              class="block text-base text-green-400 font-semibold mt-2 mb-2">Completion Reward
              ($)</label>
            <Input id="completion-reward-amount" type="number" v-model="completionRewardAmount"
              placeholder="For example 20.00" class="w-1/3" />
            <p v-if="completionError" class="mt-4 text-red-400">{{ completionError }}</p>
          </div>

          <!-- Combined reward summary -->
          <div v-if="completionRewardAmount > 0 && timeRewardAmount > 0"
            class="mt-4 mb-6 text-base text-zinc-300 space-y-2">
            <p><strong>Developer Reward:</strong> ${{ (completionRewardAmount + timeRewardAmount).toFixed(2) }}</p>
            <p><strong>Platform Fee ({{ platformFeePercent }}%):</strong> ${{ timeAndCompletionfee.toFixed(2) }}</p>
            <p class="text-green-300 font-semibold">
              <strong>Total:</strong> ${{ totalToPay.toFixed(2) }}
            </p>
          </div>

          <!-- Completion-only reward summary -->
          <div v-else-if="completionRewardAmount > 0" class="mt-4 mb-6 text-base text-zinc-300 space-y-2">
            <p><strong>Developer Reward:</strong> ${{ completionRewardAmount.toFixed(2) }}</p>
            <p><strong>Platform Fee ({{ platformFeePercent }}%):</strong> ${{ completionOnlyFee.toFixed(2) }}</p>
            <p class="text-green-300 font-semibold">
              <strong>Total:</strong> ${{ totalToPay.toFixed(2) }}
            </p>
          </div>

          <!-- Time-only reward summary -->
          <div v-else-if="timeRewardAmount > 0" class="mt-4 mb-6 text-base text-zinc-300 space-y-2">
            <p><strong>Developer Reward:</strong> ${{ timeRewardAmount.toFixed(2) }}</p>
            <p><strong>Platform Fee ({{ platformFeePercent }}%):</strong> ${{ timeOnlyFee.toFixed(2) }}</p>
            <p class="text-green-300 font-semibold">
              <strong>Total:</strong> ${{ totalToPay.toFixed(2) }}
            </p>
          </div>

          <button @click="submitCompletionReward"
            class="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded">
            Add Completion Reward
          </button>
        </div>
      </div>

      <AccordionRoot class="rounded-lg border border-zinc-700 bg-zinc-900 mb-6" default-value="item-1" v-if="openPanels"
        type="multiple" :collapsible="true">
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
