<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { createEstimate, getEstimatesRequest } from "@/controllers/EstimateController"; // <- updated import
import { getQuest } from "@/controllers/QuestBackendController";
import { CreateEstimateSchema, type CreateEstimate, type GetEstimate } from "@/types/schema/EstimateSchema";
import type { QuestPartial } from "@/types/schema/QuestStatusSchema";
import { useRoute } from "nuxt/app";
import { computed, onMounted, ref } from "vue";

// 1) Grab the route param
const route = useRoute();
const questIdFromRoute = route.params.id as string;

// 2) Resolve the logged-in user (top-level await)
const { data: user, error: userError } = await useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);


const level = ref<string | null>(null);
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

// async function submitEstimation() {

//     // ✅ Always clear error first
//     submissionError.value = null;
//     submissionSuccess.value = false;

//     const payload = {
//         questId: questIdFromRoute,
//         rank: level.value!,
//         comment: comment.value
//     };

//     // if (payload.tags.length === 0) {
//     //     submissionError.value = "Please select at least one tag.";
//     //     return;
//     // }

//     isSubmitting.value = true;

//     const userId = user.value?.sub;
//     if (!userId) {
//         submissionError.value = "User ID not available.";
//         isSubmitting.value = false;
//         return;
//     }

//     console.log("Final payload being sent:");
//     console.log(JSON.stringify(payload, null, 2));


//     const parsed = CreateEstimateSchema.safeParse(payload)

//     if (!parsed.success) {
//         submissionError.value = "Validation error: " + JSON.stringify(parsed.error.format());
//         isSubmitting.value = false;
//         return;
//     } else {
//         try {
//             const result = await createEstimate(userId, parsed.data);

//             if (result) {
//                 submissionSuccess.value = true;
//                 estimateCreatePayload.value = {
//                     questId: "",
//                     rank: "",
//                     comment: ""
//                 };
//             } else {
//                 submissionError.value = "Submission failed. Please try again.";
//             }
//         } catch (err) {
//             console.error(err);
//             submissionError.value = "An unexpected error occurred.";
//         } finally {
//             isSubmitting.value = false;
//         }
//     }
// }

async function submitEstimation() {
    // Clear old state
    submissionError.value = null;
    submissionSuccess.value = false;

    // Local validations
    if (!level.value) {
        submissionError.value = "Please select a difficulty tier.";
        return;
    }

    if (!comment.value.trim()) {
        submissionError.value = "Please enter a comment.";
        return;
    }

    const payload = {
        questId: questIdFromRoute,
        rank: level.value!,
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
            level.value = null;
        } else {
            submissionError.value = "Submission failed. Please try again.";
        }
    } catch (err) {
        console.error(err);
        submissionError.value = "An unexpected error occurred.";
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
        retrievedEstimates.value = await getEstimatesRequest(safeUserId.value || "userId not found", questIdFromRoute);
        console.debug(`[Estimation Page][getEstimatesRequest]${retrievedQuestData.value}`);
    } catch (e) {
        console.error(e);
        errorEstimates.value = "[Estimation Page] Failed to load estimates and comments.";
    } finally {
        isLoadingEstimates.value = false;
    }
});

</script>

<template>
    <NuxtLayout>
        <div class="max-w-3xl mx-auto py-12 px-6 text-white">
            <h1 class="text-3xl font-bold mb-4">Estimate Estimate Difficulty</h1>

            <div v-if="submissionSuccess" class="text-green-400 mb-4">
                ✅ Estimate submitted successfully!
            </div>
            <div v-if="submissionError" class="text-red-400 mb-4">
                ⚠️ {{ submissionError }}
            </div>

            <!-- Estimate Details -->
            <div class="bg-teal-300/70 p-6 rounded-xl mb-6">
                <h2 class="text-black text-xl font-semibold">{{ retrievedQuestData?.title }}</h2>
                <p class="text-black mt-2">{{ retrievedQuestData?.description }}</p>
            </div>

            <!-- Form -->
            <div class="mb-10">
                <label for="difficulty" class="block mb-2 text-sm font-semibold">Your Difficulty Estimate</label>

                <select v-model="level" class="w-full rounded bg-zinc-900 border border-zinc-700 p-2 text-white">
                    <option disabled value="">Choose difficulty tier</option>
                    <option v-for="opt in levelOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>


                <label for="comment" class="block mt-4 mb-2 text-sm font-semibold">Comments</label>
                <textarea id="comment" v-model="comment"
                    class="w-full rounded bg-zinc-900 border border-zinc-700 p-2 text-white" rows="4"
                    placeholder=" Thoughts, considerations, or reasoning behind your estimate..."></textarea>

                <button @click="submitEstimation"
                    class="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white" 
                    :disabled="isSubmitting"
                >
                    Submit Estimate
                </button>
            </div>

            <!-- Past Reviews -->
            <div v-if="errorEstimates" class="text-red-400">{{ errorEstimates }}</div>

            <div v-if="retrievedEstimates && retrievedEstimates.length > 0">
                <h3 class="text-lg font-semibold mb-4">Recent Estimations</h3>
                <ul class="space-y-3">
                    <li v-for="(est, i) in retrievedEstimates" :key="i"
                        class="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold">{{ est.username }}</span>
                            <span class="text-sm text-zinc-400">{{ est.rank }}</span>
                        </div>
                        <p class="text-zinc-300 text-sm">{{ est.comment }}</p>
                    </li>
                </ul>
            </div>

            <div v-else-if="!isLoadingEstimates && !errorEstimates" class="text-zinc-400 text-sm">
                No estimates yet. Be the first to add one!
            </div>


        </div>
    </NuxtLayout>
</template>
