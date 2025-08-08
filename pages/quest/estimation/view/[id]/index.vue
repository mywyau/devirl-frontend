<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { getEstimatesRequest } from "@/controllers/EstimateController"; // <- updated import
import { getQuest } from "@/controllers/QuestController";
import { type CalculatedEstimate } from "@/types/schema/EstimateSchema";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";
import { formatCountdown } from "@/utils/EstimateUtils";
import { rankClass } from "@/utils/QuestRankUtil";
import { useRoute } from "nuxt/app";
import { computed, onMounted, onUnmounted, ref } from "vue";

import {
    AccordionContent,
    AccordionHeader,
    AccordionItem,
    AccordionRoot,
    AccordionTrigger,
} from 'reka-ui';

import { Icon } from '@iconify/vue';

import { fetchEstimationExpiration } from "@/connectors/EstimationExpirationConnector";
import type { EstimationExpiration } from '@/types/schema/EstimationExpirationSchema';


// 1) Grab the route param
const route = useRoute();
const questIdFromRoute = route.params.id as string;

// 2) Resolve the logged-in user (top-level await)
const { data: user, error: userError } = await useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

const openPanels = ref<string[]>([]) // or [] to have them all closed initially

const formattedEstimationCloseAt = computed(() => {
    if (!estimationCloseAt.value) return null;
    const date = new Date(estimationCloseAt.value);
    return date.toLocaleString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    });
});

const retrievedEstimationExpiration = ref<EstimationExpiration | null>(null);
const retrievedQuestData = ref<QuestPartial | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const estimateStatus = ref<string | null>(null);

const retrievedEstimates = ref<CalculatedEstimate[] | null>(null);
const isLoadingEstimates = ref(false);
const errorEstimates = ref<string | null>(null);

const estimationIsClosed = computed(() =>
    estimateStatus.value === "EstimateClosed"
);

onMounted(async () => {

    isLoading.value = true;
    isLoadingEstimates.value = true;

    try {
        retrievedQuestData.value = await getQuest(safeUserId.value || "userId not found", questIdFromRoute);
        console.debug(`[Estimation Page][getQuest]${retrievedQuestData.value}`);

        if (retrievedEstimationExpiration.value?.estimationCloseAt) {
            updateCountdown();
            countdownInterval.value = window.setInterval(updateCountdown, 1000);
        }

    } catch (e) {
        console.error(e);
        error.value = "[Estimation Page] Failed to load quest.";
    } finally {
        isLoading.value = false;
    }

    try {
        const estimates = await getEstimatesRequest(safeUserId.value || "userId not found", questIdFromRoute);
        if (Array.isArray(estimates.calculatedEstimate)) {
            estimateStatus.value = estimates.estimationStatus
            retrievedEstimates.value = estimates.calculatedEstimate;
        } else {
            // If the API responded with something unexpected but not an error
            estimateStatus.value = estimates.estimationStatus
            errorEstimates.value = "No estimates found.";
            retrievedEstimates.value = [];
        }
    } catch (e: any) {
        console.error(e);
        if (e?.response?.status === 404) {
            errorEstimates.value = "No estimates found.";
            retrievedEstimates.value = [];
        } else {
            errorEstimates.value = "[Estimation Page] Failed to load estimates and comments.";
            console.log("[Estimation Page] Failed to load estimates and comments.");
            retrievedEstimates.value = [];
        }
    } finally {
        isLoadingEstimates.value = false;
    }

    try {
        retrievedEstimationExpiration.value = await fetchEstimationExpiration(safeUserId.value || "userId not found", questIdFromRoute);
        console.debug(`[Estimation Page][fetchEstimationExpiration]${retrievedEstimationExpiration.value}`);

        if (retrievedEstimationExpiration.value?.estimationCloseAt) {
            updateCountdown();
            countdownInterval.value = window.setInterval(updateCountdown, 1000);
        }

    } catch (e) {
        console.error(e);
        error.value = "[Estimation Page] Failed to fetch EstimationExpiration.";
    } finally {
        isLoading.value = false;
    }
});


const countdown = ref<string | null>(null);
const countdownInterval = ref<number | null>(null);
const estimationCloseAt = computed(() => retrievedEstimationExpiration.value?.estimationCloseAt || null);

function updateCountdown() {
    if (!estimationCloseAt.value) return;

    countdown.value = formatCountdown(Date.now(), estimationCloseAt.value);

    if (countdown.value === "Estimation period has ended." && countdownInterval.value !== null) {
        clearInterval(countdownInterval.value);
    }
}

onUnmounted(() => {
    if (countdownInterval.value !== null) {
        clearInterval(countdownInterval.value);
    }
});

</script>

<template>
    <NuxtLayout>

        <div class="max-w-3xl mx-auto py-12 px-6 text-black dark:text-white">

            <div class="">
                <h1 class="text-3xl font-bold mb-4">View Estimates</h1>
            </div>

            <div v-if="!isLoadingEstimates">

                <div v-if="estimationIsClosed">

                    <!-- Estimate Details -->
                    <div class="bg-teal-300 p-6 rounded mb-6 space-y-4">
                        <h2 class="text-white dark:text-black text-2xl font-semibold">{{ retrievedQuestData?.title }}
                        </h2>
                    </div>

                    <div>
                        <AccordionRoot class="rounded-lg mb-6" :default-value="['description']" v-model="openPanels"
                            type="multiple" :collapsible="true">
                            <AccordionItem
                                class="mt-px overflow-hidden first:mt-0 first:rounded-t-lg last:rounded-b-lg focus-within:relative focus-within:z-10 focus-within:ring-2 focus-within:ring-white"
                                value="description">
                                <AccordionHeader class="flex">
                                    <AccordionTrigger
                                        class="flex h-[48px] flex-1 items-center justify-between px-4 text-sm font-semibold text-black bg-teal-400 hover:bg-teal-200 transition-colors duration-200 group">
                                        <span>Description</span>
                                        <Icon icon="radix-icons:chevron-down"
                                            class="text-black transition-transform duration-300 group-data-[state=open]:rotate-180"
                                            aria-label="Expand/Collapse" />
                                    </AccordionTrigger>
                                </AccordionHeader>
                                <AccordionContent
                                    class="bg-white text-black text-sm data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                                    <div class="px-4 py-3 whitespace-pre-wrap">
                                        {{ retrievedQuestData?.description || "No description was given" }}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem
                                class="mt-px overflow-hidden last:rounded-b-lg focus-within:relative focus-within:z-10 focus-within:ring-2 focus-within:ring-white"
                                value="acceptance">
                                <AccordionHeader class="flex">
                                    <AccordionTrigger
                                        class="flex h-[48px] flex-1 items-center justify-between px-4 text-sm font-semibold text-black bg-teal-400 hover:bg-teal-200 transition-colors duration-200 group">
                                        <span>Acceptance Criteria</span>
                                        <Icon icon="radix-icons:chevron-down"
                                            class="text-black transition-transform duration-300 group-data-[state=open]:rotate-180"
                                            aria-label="Expand/Collapse" />
                                    </AccordionTrigger>
                                </AccordionHeader>
                                <AccordionContent
                                    class="bg-white text-black text-sm data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                                    <div class="px-4 py-3 whitespace-pre-wrap">
                                        {{ retrievedQuestData?.acceptanceCriteria ||
                                            "No acceptance criteria were provided"
                                        }}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </AccordionRoot>
                    </div>
                </div>
            </div>

            <div v-if="!estimationIsClosed && !estimationCloseAt"
                class="text-zinc-500 dark:text-zinc-400 text-base mt-4">
                <p>
                    There {{ retrievedEstimates?.length === 1 ? 'is' : 'are' }}
                    <span class="text-green-500 dark:text-green-400">{{ retrievedEstimates?.length }}</span>
                    {{ retrievedEstimates?.length === 1 ? 'estimate' : 'estimates' }}.
                </p>
                <p class="text-black dark:text-white mt-4" v-if="!estimationIsClosed && !estimationCloseAt">
                    Cannot display estimates, there are not enough estimates yet.
                </p>
            </div>

            <div v-if="!estimationIsClosed && estimationCloseAt" class="text-zinc-400 text-base mt-4">

                <div class="text-black dark:text-white font-sans text-lg mb-4">
                    <p class="mt-6">
                        Estimations close at:
                        <span class="text-blue-300 font-semibold">
                            {{ formattedEstimationCloseAt }}
                        </span>
                    </p>
                    <p>
                        Time remaining: <span class="text-red-300 font-mono">{{ countdown }}</span>
                    </p>
                </div>

                <p class="text-zinc-600 dark:text-zinc-300">
                    There {{ retrievedEstimates?.length === 1 ? 'is' : 'are' }}
                    <span class="text-green-500 dark:text-green-400">{{ retrievedEstimates?.length }}</span>
                    {{ retrievedEstimates?.length === 1 ? 'estimate' : 'estimates' }}.
                </p>
                <p class="text-black dark:text-white mt-6"> Estimates are still open but will close soon! </p>
                <p class="text-black dark:text-white"> Please go to the estimations page to make your contribution.</p>
                <p class="text-black dark:text-white mt-6"> Estimates will be shown here when the quest has been
                    finalized.</p>
            </div>

            <div v-if="estimationIsClosed" class="text-zinc-400 text-base mt-4">
                <p class="text-black dark:text-white">
                    There were
                    <span class="text-green-400">{{ retrievedEstimates?.length }}</span>
                    {{ retrievedEstimates?.length === 1 ? 'estimate' : 'estimates' }} made.
                </p>
            </div>

            <!-- View all Estimates made section -->

            <div v-if="!isLoadingEstimates && estimationIsClosed" class="mt-6">
                <ul class="space-y-3">
                    <li v-for="(est, i) in retrievedEstimates" :key="i" class="bg-zinc-800 p-4 rounded">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-indigo-300 font-bold">{{ est.username }}</span>
                            <span class="text-sm text-black dark:text-white">
                                Score: <span class="text-green-400">{{ est.score }}</span> | Est. Hours: <span
                                    class="text-green-400">{{ est.hours }}</span> | <span
                                    :class="`text-sm ${rankClass(est.rank)}`">{{ est.rank }}</span>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </NuxtLayout>
</template>
