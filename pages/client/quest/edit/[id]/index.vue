<script setup lang="ts">

import { useAuthUser } from "@/composables/useAuthUser";
import { getQuest, updateQuest } from "@/controllers/QuestController";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { languageFormatter, languageOptions } from "@/utils/LanguageUtils";
import { rankOptions } from "@/utils/QuestRankUtil";

import { Icon } from '@iconify/vue';


import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
  useFilter,
} from 'reka-ui';

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui';


import Input from '@/components/reka/Input.vue';
import TextArea from '@/components/reka/TextArea.vue';


interface UpdateQuestPayload {
  rank: string,
  title: string,
  description: string,
  acceptanceCriteria: string,
  tags: string[],
}

interface QuestPartial {
  rank: string,
  title: string,
  description?: string,
  acceptanceCriteria: string,
  status: string,
  tags: string[],
}

const route = useRoute();
const questId = route.params.id as string;

const questTags = ref<string[]>([]); // <- define this
const { contains } = useFilter({ sensitivity: 'base' });

const query = ref('');

const filteredOptions = computed(() =>
  languageOptions.filter(
    (option) =>
      contains(option, query.value) && !questTags.value.includes(option)
  )
);

const success = ref(false);
const showError = ref(false);
const isSubmitting = ref(false);

const { data: user, error: userError } = await useAuthUser();

const updateQuestPayload = ref<UpdateQuestPayload>({
  rank: "",
  title: "",
  description: "",
  acceptanceCriteria: "",
  tags: [],
});


console.debug(encodeURIComponent(user.value?.sub || "No user id"));
const safeUserId = user.value?.sub || "No user id";

const result = ref<QuestPartial | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  isLoading.value = true;
  try {
    result.value = await getQuest(safeUserId, questId);
    console.debug(`[Edit Quest Page][getQuest]${result.value}`);
    if (result.value) {
      updateQuestPayload.value = {
        rank: result.value.rank,
        title: result.value.title,
        description: result.value.description ?? "",
        acceptanceCriteria: result.value.acceptanceCriteria,
        tags: result.value.tags
      };
      questTags.value = result.value.tags ?? [];
    }
  } catch (e) {
    console.error(e);
    error.value = "[Edit Quest Page] Failed to load quest.";
  } finally {
    isLoading.value = false;
  }
});



async function handleUpdateQuest() {
  const currentQuestId = route.params.id as string;
  isSubmitting.value = true;

  try {

    const requestBody: UpdateQuestPayload = {
      rank: updateQuestPayload.value.rank,
      title: updateQuestPayload.value.title,
      description: updateQuestPayload.value.description ?? "",
      acceptanceCriteria: updateQuestPayload.value.acceptanceCriteria,
      tags: [...questTags.value],
    }

    await updateQuest(
      safeUserId,
      currentQuestId,
      requestBody
    );
    success.value = true;

    // await new Promise((resolve) => setTimeout(resolve, 750));
    // Redirect or refresh
    // navigateTo("/quests");
  } catch (err) {
    showError.value = true;
    // await new Promise((resolve) => setTimeout(resolve, 750));
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <NuxtLayout>

    <div class="max-w-4xl mx-auto p-6">

      <h1 class="text-3xl text-yellow-200 font-bold mb-6">Edit Quest</h1>

      <form v-if="result" @submit.prevent="handleUpdateQuest" class="space-y-4">

        <div class="flex flex-col mb-6 w-1/3">

          <label for="rank" class="text-sm font-medium text-white mb-2">Quest Tier</label>

          <SelectRoot v-model="updateQuestPayload.rank">
            <SelectTrigger 
              id="rank-select"
              class="inline-flex min-w-[160px] items-center justify-between rounded-lg px-[15px] text-sm leading-none h-[40px] gap-[5px] bg-white text-black hover:bg-stone-50 border shadow-sm focus:shadow-[0_0_0_2px] focus:shadow-green-500 outline-none"
              aria-label="Quest Tier">
              <SelectValue placeholder="Choose rank" />
              <Icon icon="radix-icons:chevron-down" class="h-4 w-4" />
            </SelectTrigger>

            <SelectPortal>
              <SelectContent class="min-w-[160px] bg-white rounded-lg border shadow-sm z-[100]" :side-offset="5">
                <SelectScrollUpButton
                  class="flex items-center justify-center h-[25px] bg-white text-black cursor-default">
                  <Icon icon="radix-icons:chevron-up" />
                </SelectScrollUpButton>

                <SelectViewport class="p-[5px]">
                  <SelectLabel class="px-4 text-xs font-medium text-zinc-500 mb-1">Tiers</SelectLabel>
                  <SelectGroup>
                    <SelectItem v-for="option in rankOptions" :id="`rank-option-${option.value}`" :key="option.value"
                      :value="option.value"
                      class="text-sm leading-none text-black rounded flex items-center h-[30px] pr-[35px] pl-[25px] relative select-none data-[highlighted]:bg-green-100 data-[highlighted]:text-black">
                      <SelectItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
                        <Icon icon="radix-icons:check" />
                      </SelectItemIndicator>
                      <SelectItemText>{{ option.label }}</SelectItemText>
                    </SelectItem>
                  </SelectGroup>
                </SelectViewport>

                <SelectScrollDownButton
                  class="flex items-center justify-center h-[25px] bg-white text-black cursor-default">
                  <Icon icon="radix-icons:chevron-down" />
                </SelectScrollDownButton>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>

        </div>

        <div class="mb-10">

          <label class="text-sm font-medium text-white mb-2">Add Language Tags</label>

          <p class="text-zinc-200 text-sm mb-2">(You can type in to search for languages)</p>

          <ComboboxRoot v-model="questTags" multiple ignore-filter class="relative" @select="() => query = ''">
            <ComboboxAnchor
              class="w-1/2 inline-flex items-center justify-between rounded-lg p-2 text-sm gap-2 bg-white text-black shadow hover:bg-stone-100 focus:shadow-[0_0_0_2px] focus:shadow-green-500 outline-none">

              <TagsInputRoot v-model="questTags" delimiter="" class="flex gap-2 items-center flex-wrap">
                <TagsInputItem v-for="item in questTags" :key="item" :value="item"
                  class="flex items-center gap-2 text-white bg-green-600 rounded px-2 py-1">
                  <TagsInputItemText class="text-sm">{{ languageFormatter(item) }}</TagsInputItemText>
                  <TagsInputItemDelete>
                    <Icon icon="lucide:x" />
                  </TagsInputItemDelete>
                </TagsInputItem>

                <ComboboxInput v-model="query" as-child>
                  <TagsInputInput id="language-tags" placeholder="Add tags..."
                    class="flex-1 rounded bg-transparent text-black placeholder:text-zinc-500 px-1 focus:outline-none"
                    @keydown.enter.prevent />
                </ComboboxInput>
              </TagsInputRoot>

              <ComboboxTrigger id="language-tags-trigger">
                <Icon icon="radix-icons:chevron-down" class="h-4 w-4 text-green-700" />
              </ComboboxTrigger>
            </ComboboxAnchor>

            <ComboboxContent
              class="absolute z-10 w-full mt-2 bg-white rounded shadow-lg will-change-[opacity,transform]">
              <ComboboxViewport class="p-2">
                <ComboboxGroup v-if="filteredOptions.length">
                  <ComboboxLabel class="px-4 text-xs text-zinc-500">Languages</ComboboxLabel>
                  <ComboboxItem v-for="(option, index) in filteredOptions" :id="`language-option-${option}`"
                    :key="index" :value="option"
                    class="text-sm text-black px-4 py-2 rounded hover:bg-green-100 cursor-pointer flex items-center justify-between">
                    {{ languageFormatter(option) }}
                    <ComboboxItemIndicator>
                      <Icon icon="radix-icons:check" />
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxViewport>
            </ComboboxContent>
          </ComboboxRoot>
        </div>

        <div class="mt-10 mb-6">

          <label for="quest-title" class="block text-sm font-medium text-white mb-2">
            Quest Title
          </label>

          <Input id="quest-title" v-model="updateQuestPayload.title"
            placeholder="Write a short, punchy title like 'Fix the broken login page'" class="w-full" />

          <p class="mt-1 text-sm text-zinc-400">Max 100 characters</p>
        </div>

        <div>
          <label for="quest-description" class="block text-sm font-medium text-white mb-2">
            Description (optional)
          </label>
          <TextArea id="quest-description" v-model="updateQuestPayload.description" placeholder="..." />
        </div>

        <div>
          <label for="acceptance-criteria" class="block text-sm font-medium text-white mb-2">
            Acceptance Criteria (required)
          </label>
          <TextArea id="acceptance-criteria" v-model="updateQuestPayload.acceptanceCriteria" placeholder="..." />
        </div>

        <div>
          <button type="submit" class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded"
            :disabled="isSubmitting">
            Update Quest
          </button>
        </div>
      </form>

      <p v-if="success" class="text-green-500 text-sm">
        Quest updated successfully!
      </p>

      <p v-if="showError" class="text-red-500 text-sm">
        Quest update unsuccessful!
      </p>
    </div>
  </NuxtLayout>
</template>
