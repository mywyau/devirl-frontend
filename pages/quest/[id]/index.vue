<script setup lang="ts">
import { useAsyncData } from "#imports"; // Nuxt auto-import
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import { useAuthUser } from "@/composables/useAuthUser";
import {
  acceptQuest,
  getQuest,
} from "@/controllers/QuestController";
import {
  QuestPartialSchema,
  type QuestPartial,
} from "@/types/schema/QuestStatusSchema";
import { getStatusTextColour } from "@/utils/QuestStatusUtils";
import { useCookie } from "nuxt/app";

import { Icon } from '@iconify/vue';
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui';

import { getStatusFormatter } from "@/utils/QuestStatusUtils";

import ConfirmDialog from '@/components/reka/ConfirmDialog.vue';


const openPanels = ref<string[]>(['description', 'acceptance']) // or [] to have them all closed initially

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

      <div v-else class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 shadow mb-6">

        <div class="flex justify-between items-center">
          <h2 :id="`quest-title`" class="text-2xl font-semibold mb-2 text-indigo-300 mb-6">
            {{ result?.title }}
          </h2>
          <span class="text-lg font-semibold">
            <span :class="`text-lg mb-4 ${getStatusTextColour(result?.status?.toString())}`">
              {{ getStatusFormatter(result?.status.toString()) }}
            </span>
          </span>
        </div>

        <div v-if="result?.status.toString() === 'Open' && userType === 'Dev'" class="mt-6 flex gap-4">

          <ConfirmDialog
            v-if="result?.status.toString() == `Open` || result?.status.toString() == `NotEstimated` || result?.status.toString() == `Completed`"
            title="Accept this quest?"
            description="Once accepted, this quest will be assigned to you and you’ll be expected to deliver based on the criteria. This cannot be undone."
            triggerText="Accept Quest" triggerClass="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white"
            actionClass="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-sans"
            @confirm="handleAcceptQuest" />

          <p v-if="acceptSuccess" class="text-green-500 text-sm pt-4">
            Successfully Accepted Quest
          </p>
          <p v-if="acceptError" class="text-red-500 text-sm">
            Failed to Accept Quest
          </p>

          <p v-if="reportSuccess" class="text-green-500 text-sm pt-4">
            Successfully Reported Quest
          </p>
          <p v-if="reportError" class="text-red-500 text-sm">
            Failed to Report Quest
          </p>
        </div>
      </div>

      <div>
        <AccordionRoot class="rounded-lg border border-zinc-700 bg-zinc-900 mb-6" default-value="description"
          v-model="openPanels" type="multiple" :collapsible="true">
          <AccordionItem
            class="mt-px overflow-hidden first:mt-0 first:rounded-t-lg last:rounded-b-lg border-b border-zinc-700 focus-within:relative focus-within:z-10 focus-within:ring-2 focus-within:ring-emerald-500"
            value="description">
            <AccordionHeader class="flex">
              <AccordionTrigger
                class="flex h-[48px] flex-1 items-center justify-between px-4 text-sm font-semibold text-teal-300 bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 group">
                <span>Description</span>
                <Icon icon="radix-icons:chevron-down"
                  class="text-white transition-transform duration-300 group-data-[state=open]:rotate-180"
                  aria-label="Expand/Collapse" />
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent
              class="bg-zinc-800 text-zinc-300 text-sm data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
              <div class="px-4 py-3">
                {{ result?.description || "No description was given" }}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            class="mt-px overflow-hidden last:rounded-b-lg border-b border-zinc-700 focus-within:relative focus-within:z-10 focus-within:ring-2 focus-within:ring-emerald-500"
            value="acceptance">
            <AccordionHeader class="flex">
              <AccordionTrigger
                class="flex h-[48px] flex-1 items-center justify-between px-4 text-sm font-semibold text-teal-300 bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 group">
                <span>Acceptance Criteria</span>
                <Icon icon="radix-icons:chevron-down"
                  class="text-white transition-transform duration-300 group-data-[state=open]:rotate-180"
                  aria-label="Expand/Collapse" />
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent
              class="bg-zinc-800 text-zinc-300 text-sm data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
              <div class="px-4 py-3">
                {{ result?.acceptanceCriteria || "No acceptance criteria were provided" }}
              </div>
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
      </div>

    </div>
  </NuxtLayout>
</template>
