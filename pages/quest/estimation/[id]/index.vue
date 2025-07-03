<script setup lang="ts">
import TextArea from '@/components/reka/TextArea.vue';
import { useAuthUser } from "@/composables/useAuthUser";
import { createEstimate, getEstimatesRequest } from "@/controllers/EstimateController"; // <- updated import
import { getQuest } from "@/controllers/QuestController";
import { CreateEstimateSchema, type CalculatedEstimate } from "@/types/schema/EstimateSchema";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";
import { useRoute } from "nuxt/app";
import { Label } from 'reka-ui';
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();

// 1) Grab the route param
const route = useRoute();
const questIdFromRoute = route.params.id as string;

// 2) Resolve the logged-in user (top-level await)
const { data: user, error: userError } = await useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

function refreshPage() {
    router.go(0);
}

// const rank = ref<string | null>(null);
const score = ref(0);
const days = ref(0);
const comment = ref("");

import Input from '@/components/reka/Input.vue';

const isSubmitting = ref(false);
const submissionSuccess = ref(false);
const submissionError = ref<string | null>(null);

const scoreError = ref<string | null>(null);
const daysError = ref<string | null>(null);
const commentError = ref<string | null>(null);

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

</script>

<template>
    <NuxtLayout>

        <div class="max-w-3xl mx-auto py-12 px-6 text-white">

            <div class="">
                <h1 class="text-3xl font-bold mb-4">Estimate Difficulty</h1>
            </div>

            <div v-if="!estimationIsClosed">

                <div v-if="submissionSuccess" class="text-green-400 mb-4">
                    Estimate submitted successfully!
                </div>

                <div v-if="submissionError" class="text-red-400 mb-4">
                    {{ submissionError }}
                </div>

                <!-- Estimate Details -->
                <div class="bg-teal-300/70 p-6 rounded mb-6 space-y-4">
                    <h2 class="text-black text-2xl font-semibold">{{ retrievedQuestData?.title }}</h2>
                    <h3 class="text-zinc-900 text-xl font-semibold underline">Description</h3>
                    <p class="text-zinc-800 text-base mt-2">{{ retrievedQuestData?.description || "No description was given" }}</p>
                    <h3 class="text-zinc-900 text-xl font-semibold underline">Acceptance Criteria</h3>
                    <p class="text-zinc-800 text-base mt-2">{{ retrievedQuestData?.acceptanceCriteria }}</p>
                </div>

                <!-- Form -->
                <div class="mb-10">

                    <Label class="text-sm font-semibold leading-[35px] text-stone-700 dark:text-white" for="difficulty">
                        Difficulty Score Estimate (1-100)
                    </Label>

                    <div>
                        <Input id="difficulty-score" type="number" v-model="score" placeholder="0" class="w-1/4" />
                        <p v-if="scoreError" class="text-sm text-red-400 mt-1">{{ scoreError }}</p>
                    </div>

                    <Label class="text-sm font-semibold leading-[35px] text-stone-700 dark:text-white"
                        for="number-of-days">
                        Number of Days Estimate (1-10)
                    </Label>

                    <div>
                        <Input id="number-of-day" type="number" v-model="days" placeholder="0" class="w-1/4" />
                        <p v-if="daysError" class="text-sm text-red-400 mt-1">{{ daysError }}</p>
                    </div>
                    <Label class="text-sm font-semibold leading-[35px] text-stone-700 dark:text-white" for="comment">
                        Comments
                    </Label>

                    <TextArea id="comment" v-model="comment"
                        placeholder="Thoughts, considerations, or reasoning behind your estimate..." />

                    <p v-if="commentError" class="text-sm text-red-400 mt-1">{{ commentError }}</p>


                    <button @click="submitEstimation"
                        class="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white"
                        :disabled="isSubmitting">
                        Submit Estimate
                    </button>
                </div>
            </div>

            <div v-else class="text-yellow-400 text-lg font-semibold mt-6">
                Estimations are closed for this quest.
            </div>

            <!-- Past Reviews -->

            <div v-if="estimationIsClosed && retrievedEstimates.length > 0">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">Recent Estimations</h3>
                    <button @click="refreshPage"
                        class="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-3 py-1.5 rounded transition-colors duration-200">
                        Refresh
                    </button>

                </div>
                <ul class="space-y-3">
                    <li v-for="(est, i) in retrievedEstimates" :key="i" class="bg-zinc-800 p-4 rounded">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold">{{ est.username }}</span>
                            <span class="text-sm text-zinc-400">
                                Score: {{ est.score }} | Est. Days: {{ est.days }} | {{ est.rank }}
                            </span>
                        </div>
                        <p class="text-zinc-300 text-sm">{{ est.comment }}</p>
                    </li>
                </ul>
            </div>


            <div v-else="!isLoadingEstimates && !errorEstimates" class="text-zinc-400 text-base">
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
