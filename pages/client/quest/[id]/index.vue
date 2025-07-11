<script setup lang="ts">
import { useAsyncData, useRequestHeaders } from "#imports";
import { Button } from "@/components/ui/button/variants";
import { getStatusTextColour } from "@/utils/QuestStatusUtils";
import { computed, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

import { deleteQuest, getQuest, updateQuestStatus } from "@/controllers/QuestController";
import {
  QuestPartialSchema,
  type QuestPartial,
} from "@/types/schema/QuestStatusSchema";

import { useAuthUser } from "@/composables/useAuthUser";

import { getEstimatesRequest } from "@/controllers/EstimateController";
import type { GetEstimate } from "@/types/schema/EstimateSchema";
import { useRouter } from "vue-router";

import ConfirmDialog from '@/components/reka/ConfirmDialog.vue';

const router = useRouter();

// 1) Grab the route param
const route = useRoute();
const questId = route.params.id as string;

// 2) Resolve the logged‐in user (SSR will forward the cookie via useAuthUser)
const { data: user } = await useAuthUser();
const safeUserId = computed(() => user.value?.sub || "");

// 3) Grab the incoming “cookie” header so we can forward it into getQuest()
const requestHeaders = useRequestHeaders(["cookie"]);

// 4) Fetch quest data exactly once on the server, skip client‐side re‐fetch
const {
  data: rawQuestData,
  pending,
  error: fetchError,
} = await useAsyncData<null | Record<string, unknown>>(
  `quest-${questId}`,
  () => {
    if (safeUserId.value) {
      // return getQuest(safeUserId.value, questId);
      return getQuest(safeUserId.value, questId, { headers: requestHeaders });
    }
    return Promise.resolve(null);
  },
  {
    server: true, // run on SSR
    lazy: true, // do NOT re‐fetch on client
    default: () => null,
  }
);

console.debug("SSR rawQuestData:", rawQuestData.value);

// 5) Log SSR result (for debugging)
if (process.server) {
  watchEffect(() => {
    console.debug("SSR rawQuestData:", rawQuestData.value);
  });
}

// 6) Validate with Zod
const parsed = computed(() => {
  if (!rawQuestData.value) return null;
  return QuestPartialSchema.safeParse(rawQuestData.value);
});
const result = computed<QuestPartial | null>(() =>
  parsed.value?.success ? parsed.value.data : null
);

// 7) Build a single error message
const errorMessage = computed<string | null>(() => {
  if (fetchError.value) return "Failed to load quest.";
  if (parsed.value && !parsed.value.success) {
    console.error("Zod parsing error:", parsed.value.error.format());
    return "Invalid quest data received.";
  }
  return null;
});

// 8) Tie “Loading…” to pending
const isLoading = pending;

// 9) Client‐only state for delete
const deleteSuccess = ref(false);
const deleteError = ref(false);


// 9) Client‐only state for delete
const changeToOpenSuccess = ref(false);
const changeToOpenError = ref(false);

async function handleChangeToOpenRequest() {
  if (!safeUserId.value) {
    deleteError.value = true;
    return;
  }
  try {
    await updateQuestStatus(safeUserId.value, questId, { questStatus: "Open" });
    changeToOpenSuccess.value = true;
  } catch (err) {
    changeToOpenError.value = true;
    console.error(err);
  }
}

async function handleDeleteQuest() {
  if (!safeUserId.value) {
    deleteError.value = true;
    return;
  }
  try {
    // On the client, credentials: "include" is enough to send the cookie
    await deleteQuest(safeUserId.value, questId);
    deleteSuccess.value = true;
  } catch (err) {
    deleteError.value = true;
    console.error(err);
  }
}

const retrievedEstimates = ref<GetEstimate | null>(null);
const isLoadingEstimates = ref(false);
const errorEstimates = ref<string | null>(null);

async function loadEstimates() {
  isLoadingEstimates.value = true;
  try {
    retrievedEstimates.value = await getEstimatesRequest(safeUserId.value || "userId not found", questId);
    console.debug(`[Estimation Page][getEstimatesRequest]`, retrievedEstimates.value);
  } catch (e) {
    console.error(e);
    errorEstimates.value = "Failed to load estimates and comments.";
  } finally {
    isLoadingEstimates.value = false;
  }
}

</script>

<template>
  
  <NuxtLayout>

    <div class="p-4 sm:p-6 max-w-4xl mx-auto">

      <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-pink-300">Quest Details</h1>

      <div v-if="isLoading" class="text-zinc-400">Loading quest…</div>

      <div v-else-if="errorMessage" class="text-red-500">
        {{ errorMessage }}
      </div>

      <div v-else-if="!safeUserId" class="text-yellow-300">
        You must be logged in to see this quest.
        <a href="/login" class="underline">Log in here</a>.
      </div>

      <div v-else class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 shadow">

        <h2 :id="`quest-title`"
          :class="`text-2xl font-semibold ${getStatusTextColour(result?.status?.toString())} mb-2`">
          {{ result?.title }}
        </h2>

        <p class="text-zinc-300 text-sm break-words">{{ result?.description }}</p>

        <div>
          <span class="text-white font-semibold">Status: </span>

          <span :class="`capitalize ${getStatusTextColour(result?.status?.toString())}`">{{
            result?.status.toString()
          }}</span>
        </div>

        <div class="mt-6 flex flex-wrap gap-4">

          <div class="mt-6 flex flex-col sm:flex-row flex-wrap gap-4">

            <Button variant="default" class="w-full sm:w-auto bg-teal-500 text-white rounded hover:bg-teal-400"
              @click="router.push(`/client/quest/download/${questId}`)">
              Download File
            </Button>

            <Button variant="secondary" class="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-400 text-white rounded"
              v-if="result?.status.toString() == `Open` || result?.status.toString() == `Estimated`"
              @click="loadEstimates">
              Load Estimates
            </Button>

            <a v-if="result?.status.toString() == `NotEstimated`" :href="`/client/quest/edit/${questId}`" rel="external"
              class="text-white">
              <Button variant="secondary" class="w-full sm:w-auto bg-yellow-500 text-white rounded hover:bg-yellow-400">
                Edit quest
              </Button>
            </a>

            <a v-if="result?.status.toString() == `Open` || result?.status.toString() == `NotEstimated` || result?.status.toString() == `Estimated`"
              :href="`/client/quest/reward/add/${questId}`" rel="external" class="text-white">
              <Button variant="secondary"
                class="w-full sm:w-auto bg-emerald-500 text-white rounded hover:bg-emerald-400">
                Add a Reward
              </Button>
            </a>

            <ConfirmDialog
              v-if="result?.status.toString() == `Open` || result?.status.toString() == `NotEstimated` || result?.status.toString() == `Completed`"
              title="Confirm Deletion"
              description="Are you sure you want to permanently delete this quest? This cannot be undone."
              triggerText="Delete quest"
              :triggerClass="'w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white rounded px-4 py-2 text-sm font-medium'"
              @confirm="handleDeleteQuest" />

            <ConfirmDialog v-if="result?.status.toString() == `Estimated`" title="Confirm Status Change"
              description="Are you sure you want to reopen this quest? It will go back to the Open state and accept new estimates."
              triggerText="Set to Open"
              :triggerClass="'w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white rounded px-4 py-2 text-sm font-medium'"
              @confirm="handleChangeToOpenRequest" />

            <!-- this needs to be available only when a reward has been added-->
            <a v-if="result?.status.toString() == `Open` || result?.status.toString() == `NotEstimated`"
              :href="`/payment/${questId}`" rel="external" class="text-white">
              <Button variant="secondary"
                class="w-full sm:w-auto bg-emerald-500 text-white rounded hover:bg-emerald-400">
                Make payment
              </Button>
            </a>
          </div>
        </div>

        <!-- Past Reviews -->
        <div v-if="errorEstimates" class="text-red-400 pt-4">{{ errorEstimates }}</div>

        <div class="mt-10" v-if="retrievedEstimates && retrievedEstimates.calculatedEstimate.length > 0">
          <h3 class="text-white text-lg font-semibold mb-4">Recent Estimations</h3>
          <ul class="space-y-3">
            <li v-for="(est, i) in retrievedEstimates.calculatedEstimate" :key="i"
              class="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                <span class="text-white font-bold">{{ est.username }}</span>
                <span class="text-sm text-white">{{ est.rank }}</span>
              </div>
              <p class="text-zinc-300 text-sm break-words">{{ est.comment }}</p>
            </li>
          </ul>
        </div>

        <p v-if="deleteSuccess" class="text-green-500 text-sm pt-4">
          Quest Deleted successfully!
        </p>

        <p v-if="deleteError" class="text-red-500 text-sm">
          Delete quest unsuccessful!
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>
