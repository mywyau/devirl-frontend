<script setup lang="ts">
import ConfirmDialog from '@/components/reka/ConfirmDialog.vue';
import { useRoute, useRouter } from 'nuxt/app';
import { computed, ref } from 'vue';


const route = useRoute()
const router = useRouter();
const questId = route.params.questId as string

import {
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuPortal,
    ContextMenuRoot,
    ContextMenuTrigger,
} from "reka-ui";


const developerCandidates = ref([
    {
        devId: 'dev-001',
        username: 'codewarrior',
        bid: { amount: 500 },
        estimation: {
            score: 88,
            estimatedDays: 3,
            comment: 'I’ve used Stripe and can do this fast.',
        },
    },
    {
        devId: 'dev-002',
        username: 'bughunter',
        bid: { amount: 450 },
        estimation: null,
    },
    {
        devId: 'dev-003',
        username: 'fastdev',
        bid: null,
        estimation: {
            score: 72,
            estimatedDays: 5,
            comment: 'Solid experience but new to Stripe.',
        },
    },
])

const assignDev = (devId: string) => {
    const username = developerCandidates.value.find(d => d.devId === devId)?.username
    alert(`Developer @${username} assigned!`)
    console.log(`Assigning dev ${devId} to quest ${questId}`)
}

// Stats
const bids = computed(() => developerCandidates.value.filter(d => d.bid))
const avgBid = computed(() =>
    bids.value.length
        ? (bids.value.reduce((sum, d) => sum + d.bid!.amount, 0) / bids.value.length).toFixed(2)
        : null
)

const estimates = computed(() => developerCandidates.value.filter(d => d.estimation))

const avgDays = computed(() =>
    estimates.value.length
        ? (estimates.value.reduce((sum, d) => sum + d.estimation!.estimatedDays, 0) / estimates.value.length).toFixed(1)
        : null
)

const avgComplexityScore = computed(() =>
    estimates.value.length
        ? (estimates.value.reduce((sum, d) => sum + d.estimation!.score, 0) / estimates.value.length).toFixed(1)
        : null
)

const showAssignDev = ref(false);


</script>

<template>
    <NuxtLayout>

        <div class="p-6 max-w-4xl mx-auto">

            <h1 class="text-white text-3xl font-bold mb-6">Assign a Developer</h1>

            <p class="text-white mb-6">Choose who you want to work on your quest</p>

            <div class="bg-white text-black p-4 rounded-xl mb-6">
                <p class="text-black font-semibold">Average Bid:
                    <span class="text-green-500 font-sans" v-if="avgBid">${{ avgBid }}</span>
                    <span v-else>-</span>
                </p>

                <p class="text-black font-semibold">Total Bids: {{ bids.length }}</p>
                <p class="text-black font-semibold">Average Estimated Days:
                    <span class="text-blue-500 font-sans" v-if="avgDays">{{ avgDays }} days</span>
                    <span v-else>-</span>
                </p>
                <p class="text-black font-semibold">Average Complexity Score:
                    <span class="text-rose-500 font-sans" v-if="avgComplexityScore">{{ avgComplexityScore }}
                        points</span>
                    <span v-else>-</span>
                </p>
            </div>

            <div v-for="dev in developerCandidates" :key="dev.devId">
                <ContextMenuRoot>
                    <ContextMenuTrigger as-child>
                        <div class="bg-zinc-700/80 p-4 mb-4 rounded-xl shadow hover:bg-zinc-600/80">

                            <h2 class="text-white text-xl font-semibold">{{ dev.username }}</h2>

                            <div class="mt-2">
                                <p class="text-white" v-if="dev.bid">Bid:
                                    <span class="text-green-400">
                                        ${{ dev.bid.amount }}
                                    </span>
                                </p>
                                <p v-else class="text-white italic">No bid submitted</p>
                            </div>

                            <div class="mt-2">
                                <div v-if="dev.estimation">
                                    <p class="text-white">Complexity Score:
                                        <span class="text-rose-400"> {{ dev.estimation.score }}</span>
                                    </p>
                                    <p class="text-white">Estimated Days:
                                        <span class="text-blue-400">{{ dev.estimation.estimatedDays }}</span>
                                    </p>
                                </div>

                                <p v-else class="text-white italic mt-4">No estimation submitted</p>
                            </div>
                        </div>
                    </ContextMenuTrigger>

                    <ContextMenuPortal>
                        <ContextMenuContent
                            class="min-w-[220px] z-50 bg-white rounded-lg p-1 shadow-xl border border-teal-200 text-sm text-teal-900">

                            <ContextMenuItem @click="showAssignDev = true"
                                class="px-3 py-2 rounded-md cursor-pointer hover:bg-teal-100 focus:bg-teal-100 outline-none transition">
                                Assign Dev
                            </ContextMenuItem>

                            <ContextMenuItem
                                @click="router.push(`/assing/estimate/comments/${encodeURIComponent(dev.devId)}/${questId}`)"
                                class="px-3 py-2 rounded-md cursor-pointer hover:bg-teal-100 focus:bg-teal-100
                                outline-none
                                transition">
                                View comments
                            </ContextMenuItem>

                        </ContextMenuContent>
                    </ContextMenuPortal>
                </ContextMenuRoot>

                <ConfirmDialog v-model:open="showAssignDev" title="Confirm Assignment"
                    description="Are you sure you want to assign the quest to this developer? This cannot be undone."
                    triggerText="Assign to Developer" :triggerClass="'hidden'"
                    actionClass="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-sans"
                    @confirm="assignDev(dev.devId)" 
                />
            </div>
        </div>
    </NuxtLayout>
</template>