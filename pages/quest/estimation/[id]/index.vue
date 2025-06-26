<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { createEstimate, getEstimatesRequest } from "@/controllers/EstimateController"; // <- updated import
import { getQuest } from "@/controllers/QuestBackendController";
import { CreateEstimateSchema, type CreateEstimate, type GetEstimate } from "@/types/schema/EstimateSchema";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";
import { useRoute } from "nuxt/app";
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

const rank = ref<string | null>(null);
const comment = ref("");

const levelOptions = [
    { value: "Bronze", label: "Bronze" },
    { value: "Iron", label: "Iron" },
    { value: "Steel", label: "Steel" },
    { value: "Mithril", label: "Mithril" },
    { value: "Adamantite", label: "Adamantite" },
    { value: "Runic", label: "Runic" },
    { value: "Ruinous", label: "Ruinous" },
    { value: "Demon", label: "Demon" },
    { value: "Aether", label: "Aether" },
];

const isSubmitting = ref(false);
const submissionSuccess = ref(false);
const submissionError = ref<string | null>(null);

const estimateCreatePayload = ref<CreateEstimate>(
    {
        questId: "",
        rank: "",
        comment: "",
    }
);

async function submitEstimation() {
    // Clear old state
    submissionError.value = null;
    submissionSuccess.value = false;

    // Local validations
    if (!rank.value) {
        submissionError.value = "Please select a difficulty tier.";
        return;
    }

    if (!comment.value.trim()) {
        submissionError.value = "Please enter a comment.";
        return;
    }

    const payload = {
        questId: questIdFromRoute,
        rank: rank.value!,
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

    if (!parsed.success) {
        submissionError.value = "Validation error: " + JSON.stringify(parsed.error.format());
        isSubmitting.value = false;
        return;
    }

    try {
        const result = await createEstimate(userId, parsed.data);

        if (result) {
            submissionSuccess.value = true;
            comment.value = "";
            rank.value = null;
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

const retrievedEstimates = ref<GetEstimate[] | null>(null);
const isLoadingEstimates = ref(false);
const errorEstimates = ref<string | null>(null);

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
        if (Array.isArray(estimates)) {
            retrievedEstimates.value = estimates;
        } else {
            // If the API responded with something unexpected but not an error
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

            <div v-if="submissionSuccess" class="text-green-400 mb-4">
                ✅ Estimate submitted successfully!
            </div>
            <div v-if="submissionError" class="text-red-400 mb-4">
                {{ submissionError }}
            </div>

            <!-- Estimate Details -->
            <div class="bg-teal-300/70 p-6 rounded mb-6 space-y-4">
                <h2 class="text-black text-2xl font-semibold">{{ retrievedQuestData?.title }}</h2>
                <p class="text-zinc-800 text-base mt-2">{{ retrievedQuestData?.description }}</p>
                <h3 class="text-black/90 text-xl font-semibold">Acceptance Criteria</h3>
                <p class="text-zinc-800 text-base mt-2">{{ retrievedQuestData?.acceptanceCriteria }}</p>
            </div>

            <!-- Form -->
            <div class="mb-10">
                <label for="difficulty" class="block mb-2 text-sm font-semibold">Difficulty Tier Estimate</label>

                <select 
                    v-model="rank"
                    class="w-full rounded bg-zinc-800 border border-zinc-700 p-2 text-white focus:outline-none focus:ring-1 focus:ring-green-400"
                >
                    <option disabled value="">Choose difficulty tier</option>
                    <option v-for="opt in levelOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>


                <label for="comment" class="block mt-4 mb-2 text-sm font-semibold">Comments</label>
                <textarea id="comment" v-model="comment"
                    class="w-full rounded bg-zinc-800 border border-zinc-700 p-2 text-white focus:outline-none focus:ring-1 focus:ring-green-400"
                    rows="4" placeholder=" Thoughts, considerations, or reasoning behind your estimate...">
                </textarea>

                <button @click="submitEstimation"
                    class="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white" :disabled="isSubmitting">
                    Submit Estimate
                </button>
            </div>

            <!-- Past Reviews -->

            <div v-if="retrievedEstimates && retrievedEstimates.length > 0">
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
                            <span class="text-sm text-zinc-400">{{ est.rank }}</span>
                        </div>
                        <p class="text-zinc-300 text-sm">{{ est.comment }}</p>
                    </li>
                </ul>
            </div>

            <div v-else="!isLoadingEstimates && !errorEstimates" class="text-zinc-400 text-base">
                No estimates yet. Be the first to add one!
            </div>
        </div>
    </NuxtLayout>
</template>
