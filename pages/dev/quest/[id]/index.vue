<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAsyncData } from "#imports"; // Nuxt auto-import
import { computed, ref } from "vue";

import {
  getQuest,
  acceptQuest,
} from "@/controllers/QuestController";
import {
  QuestPartialSchema,
  type QuestPartial,
} from "@/types/schema/QuestStatusSchema";
import { useAuthUser } from "@/composables/useAuthUser";
import { Button } from "@/components/ui/button/variants";
import { useCookie } from "nuxt/app";
import { getStatusTextColour, getStatusFormatter } from "@/utils/QuestStatusUtils"

import { useRouter } from 'vue-router';


const router = useRouter();

function goToRewards() {
  router.push('/dev/rewards/claim');
}

const userType = useCookie("user_type"); // reads cookie on client and SSR

// 1) Grab the route param
const route = useRoute();
const questIdFromRoute = route.params.id as string;

// 2) Resolve the logged-in user (top-level await)
const { data: user, error: userError } = await useAuthUser();
const safeUserId = computed(() => user.value?.sub ?? null);

// 3) Fetch quest data via useAsyncData (runs on server, then hydrates)
const {
  data: rawQuestData,
  pending,
  error: fetchError,
} = await useAsyncData(
  `quest-${questIdFromRoute}`,
  () => getQuest(safeUserId.value, questIdFromRoute),
  {
    server: true, // run on server only
    client: false, // do NOT run again on the client
    default: () => null,
  }
);

// 4) Validate and parse with Zod
const parsed = computed(() => {
  if (!rawQuestData.value) return null;
  return QuestPartialSchema.safeParse(rawQuestData.value);
});

// 5) Expose a `result` (the typed QuestPartial) or `null`
const result = computed<QuestPartial | null>(() => {
  if (parsed.value?.success) return parsed.value.data;
  return null;
});

// 6) Build an `error` message if fetch fails or Zod parsing fails
const error = computed<string | null>(() => {
  if (fetchError.value) {
    return "Failed to load quest.";
  }
  if (parsed.value && !parsed.value.success) {
    return "Invalid quest data received.";
  }
  return null;
});

// 7) Tie `isLoading` to the pending state of the fetch
const isLoading = pending;

// 8) (Optional) keep your “accept”/“report” state for future actions
const acceptSuccess = ref(false);
const acceptError = ref(false);

// If you need to implement a handler later, you can do:
async function handleAcceptQuest() {
  if (!safeUserId.value) {
    acceptError.value = true;
    return;
  }
  try {
    // On the client, credentials: "include" is enough to send the cookie
    await acceptQuest(safeUserId.value, {
      devId: safeUserId.value,
      questId: questIdFromRoute,
    });
    acceptSuccess.value = true;
  } catch (err) {
    acceptError.value = true;
    console.error(err);
  }
}

const reportSuccess = ref(false);
const reportError = ref(false);

</script>

<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto text-white">
      <h1 class="text-3xl font-bold mb-6 text-pink-300">Quest Details</h1>

      <div v-if="isLoading" class="text-zinc-400">Loading quest...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 shadow">
        <h2 :class="`text-2xl font-semibold mb-2 ${getStatusTextColour(
          result?.status?.toString()
        )}`">
          {{ result?.title }}
        </h2>

        <p class="mb-4 text-zinc-300">
          {{ result?.description }}
        </p>

        <div>
          <span class="font-semibold">Status: </span>

          <span :class="`font-semibold mb-4 ${getStatusTextColour(result?.status?.toString())}`">
            {{ getStatusFormatter(result?.status.toString()) }}
          </span>
        </div>

        <div v-if="result?.status.toString() === 'Open'" class="mt-6 flex gap-4">
          <Button variant="secondary" class="bg-red-500 text-white rounded hover:bg-red-400" @click="">
            Report Quest
          </Button>

          <Button v-if="userType === 'Dev'" variant="secondary"
            class="bg-green-500 text-white rounded hover:bg-green-400" @click="handleAcceptQuest">
            Accept Quest
          </Button>
        </div>

        <div v-if="result?.status.toString() === 'Completed'" class="mt-6 flex gap-4">
          <button v-if="userType === 'Dev'" @click="goToRewards"
            class="bg-emerald-500/90 hover:bg-emerald-400/90 text-white px-4 py-2 rounded">
            Rewards
          </button>
        </div>

        <p v-if="acceptSuccess" class="text-green-500 text-sm pt-4">
          Accept Quest Succeded
        </p>
        <p v-if="acceptError" class="text-red-500 text-sm">
          Accept Quest Failed!
        </p>

        <p v-if="reportSuccess" class="text-green-500 text-sm pt-4">
          Report Quest Succeded!
        </p>
        <p v-if="reportError" class="text-red-500 text-sm">
          Report Quest Failed!
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>
