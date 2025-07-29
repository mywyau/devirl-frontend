<script setup lang="ts">
import ConfirmDialog from '@/components/reka/ConfirmDialog.vue';
import Input from '@/components/reka/Input.vue';
import TextArea from '@/components/reka/TextArea.vue';
import { useAuthUser } from "@/composables/useAuthUser";
import { createEstimate, getEstimatesRequest } from "@/controllers/EstimateController"; // <- updated import
import { getQuest } from "@/controllers/QuestController";
import { CreateEstimateSchema, type CalculatedEstimate } from "@/types/schema/EstimateSchema";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";
import { formatCountdown } from "@/utils/EstimateUtils";
import { rankClass } from "@/utils/QuestRankUtil";
import { useRoute } from "nuxt/app";
import { Label } from 'reka-ui';
import { computed, onMounted, onUnmounted, ref } from "vue";

import {
    AccordionContent,
    AccordionHeader,
    AccordionItem,
    AccordionRoot,
    AccordionTrigger,
} from 'reka-ui';

import { Icon } from '@iconify/vue';


// 1) Grab the route param
const route = useRoute();
const questIdFromRoute = route.params.id as string;

// 2) Resolve the logged-in user (top-level await)
const { data: user, error: userError } = await useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

const openPanels = ref<string[]>(['description', 'acceptance']) // or [] to have them all closed initially

const score = ref(0);
const days = ref(0);
const comment = ref("");

const isSubmitting = ref(false);
const submissionSuccess = ref(false);
const submissionError = ref<string | null>(null);

const scoreError = ref<string | null>(null);
const daysError = ref<string | null>(null);
const commentError = ref<string | null>(null);

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

async function submitEstimation() {

    // Clear old state
    submissionError.value = null;
    submissionSuccess.value = false;

    // Local validations
    if (score.value == 0) {
        submissionError.value = "Please enter a score between 1-100";
        return;
    }

    if (days.value == 0) {
        submissionError.value = "Please enter an estimated number of days to complete the work";
        return;
    }


    if (!comment.value.trim()) {
        submissionError.value = "Please enter a comment.";
        return;
    }

    const payload = {
        questId: questIdFromRoute,
        score: score.value,
        days: days.value,
        comment: comment.value.trim(),
    };

    isSubmitting.value = true;

    const userId = user.value?.sub;
    if (!userId) {
        submissionError.value = "User ID not available.";
        isSubmitting.value = false;
        return;
    }

    const parsed = CreateEstimateSchema.safeParse(payload);

    console.log(parsed)

    if (!parsed.success) {
        // Reset all field errors
        scoreError.value = null;
        daysError.value = null;
        commentError.value = null;

        parsed.error.issues.forEach(issue => {
            const path = issue.path.join(".");
            const message = issue.message;

            switch (path) {
                case "score":
                    scoreError.value = message;
                    break;
                case "days":
                    daysError.value = message;
                    break;
                case "comment":
                    commentError.value = message;
                    break;
            }
        });

        isSubmitting.value = false;
        return;
    }

    try {
        const result = await createEstimate(userId, parsed.data);

        if (result) {
            submissionSuccess.value = true;
            comment.value = "";
            score.value = 0;
            days.value = 0;
        } else {
            submissionError.value = "Submission failed. Please try again.";
        }
    } catch (err) {

        console.error(err);
        submissionError.value = "An unexpected error occurred or you have already made an estimate"; // double creation does not work hence error

    } finally {
        isSubmitting.value = false;
    }
}


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

        if (retrievedQuestData.value?.estimationCloseAt) {
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
});


const countdown = ref<string | null>(null);
const countdownInterval = ref<number | null>(null);
const estimationCloseAt = computed(() => retrievedQuestData.value?.estimationCloseAt || null);

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

        <div class="max-w-3xl mx-auto py-12 px-6 text-white">

            <div class="">
                <h1 class="text-3xl font-bold mb-4">Estimate Difficulty</h1>
            </div>

            <div v-if="estimationCloseAt && !estimationIsClosed" class="text-white font-sans text-lg mb-4">
                Estimations close at: <span class="text-blue-300 font-semibold">{{ formattedEstimationCloseAt }}</span>
                <br />
                Time remaining: <span class="text-red-300 font-mono">{{ countdown }}</span>
            </div>

            <div v-if="!isLoadingEstimates">

                <div v-if="!estimationIsClosed">

                    <div v-if="submissionSuccess" class="text-green-400 mb-4">
                        Estimate submitted successfully!
                    </div>

                    <div v-if="submissionError" class="text-red-400 mb-4">
                        {{ submissionError }}
                    </div>

                    <!-- Estimate Details -->
                    <div class="bg-teal-300 p-6 rounded mb-6 space-y-4">
                        <h2 class="text-black text-2xl font-semibold">{{ retrievedQuestData?.title }}</h2>
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
                                    <div class="px-4 py-3">
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
                                    <div class="px-4 py-3">
                                        {{ retrievedQuestData?.acceptanceCriteria || "No acceptance criteria were provided" }}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </AccordionRoot>
                    </div>


                    <!-- Form -->
                    <div class="mb-10">

                        <Label class="text-sm font-semibold leading-[35px] text-stone-700 dark:text-white"
                            for="difficulty">
                            Difficulty Score (1-100)
                        </Label>

                        <div>
                            <Input id="difficulty-score" type="number" v-model="score" placeholder="0" class="w-1/4" />
                            <p v-if="scoreError" class="text-sm text-red-400 mt-1">{{ scoreError }}</p>
                        </div>

                        <Label class="text-sm font-semibold leading-[35px] text-stone-700 dark:text-white"
                            for="number-of-days">
                            Number of Days (1-10)
                        </Label>

                        <div>
                            <Input id="number-of-day" type="number" v-model="days" placeholder="0" class="w-1/4" />
                            <p v-if="daysError" class="text-sm text-red-400 mt-1">{{ daysError }}</p>
                        </div>
                        <Label class="text-sm font-semibold leading-[35px] text-stone-700 dark:text-white"
                            for="comment">
                            Comments
                        </Label>

                        <TextArea id="comment" v-model="comment"
                            placeholder="Thoughts, considerations, or reasoning behind your estimate..." />

                        <p v-if="commentError" class="text-sm text-red-400 mt-1">{{ commentError }}</p>

                        <ConfirmDialog title="Confirm Estimate Submission"
                            description="Are you sure you want to submit this estimate? You can only submit once and it cannot be changed."
                            triggerText="Submit Estimate" actionText="Yes, submit" :disabled="isSubmitting"
                            @confirm="submitEstimation"
                            triggerClass="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white"
                            actionClass="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-medium" />

                    </div>
                </div>

                <div v-else class="text-red-400 text-lg font-semibold mt-6 mb-6">
                    Estimations are closed for this quest
                </div>
            </div>

            <!-- Past Reviews -->

            <div v-if="!isLoadingEstimates && estimationIsClosed && retrievedEstimates.length > 0">

                <div class="flex justify-between items-center">

                </div>
                <ul class="space-y-3">
                    <li v-for="(est, i) in retrievedEstimates" :key="i" class="bg-zinc-800 p-4 rounded">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-indigo-300 font-bold">{{ est.username }}</span>
                            <span class="text-sm text-white">
                                Score: <span class="text-green-400">{{ est.score }}</span> | Est. Days: <span
                                    class="text-green-400">{{ est.days }}</span> | <span
                                    :class="`text-sm ${rankClass(est.rank)}`">{{ est.rank }}</span>
                            </span>
                        </div>
                        <p class="text-zinc-300 text-sm">{{ est.comment }}</p>
                    </li>
                </ul>
            </div>


            <div class="text-zinc-400 text-base mt-4">
                <p>
                    There {{ retrievedEstimates?.length === 1 ? 'is' : 'are' }}
                    <span class="text-green-400">{{ retrievedEstimates?.length }}</span>
                    {{ retrievedEstimates?.length === 1 ? 'estimate' : 'estimates' }}.
                </p>
                <p>
                    Cannot display estimates, there are not enough estimates yet.
                </p>
            </div>

        </div>
    </NuxtLayout>
</template>
