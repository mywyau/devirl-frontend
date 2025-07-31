<script setup lang="ts">

import { useAuthUser } from "@/composables/useAuthUser";
import { getQuest, updateQuest } from "@/controllers/QuestController";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { languageFormatter, languageOptions } from "@/utils/HiscoresUtils";
import { rankOptions } from "@/utils/QuestRankUtil";

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import Input from '@/components/reka/Input.vue';
import TextArea from '@/components/reka/TextArea.vue';
import { UpdateQuestSchema, type QuestPartial } from "@/types/schema/QuestStatusSchema";

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

const route = useRoute();
const questId = route.params.id as string;

const auth = await useAuthUser();

const user = auth.data;
const userError = auth.error;

const { contains } = useFilter({ sensitivity: 'base' });

const query = ref('');

const filteredOptions = computed(() => {
  const currentTags = Array.isArray(tags) ? tags : []
  return languageOptions.filter(
    (option) => contains(option, query.value) && !currentTags.includes(option)
  )
})

const {
  handleSubmit,
  defineField,
  errors,
  isSubmitting,
} = useForm<UpdateQuestSchema>({
  validationSchema: toTypedSchema(UpdateQuestSchema),
});

const [rank, rankAttrs] = defineField('rank');
const [title, titleAttrs] = defineField('title');
const [description, descriptionAttrs] = defineField('description');
const [acceptanceCriteria, acceptanceCriteriaAttrs] = defineField('acceptanceCriteria');
const [tags, tagsAttrs] = defineField('tags');

const submissionSuccess = ref(false);
const submissionError = ref<string | null>(null);

const result = ref<QuestPartial | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {

  const safeUserId = user.value?.sub || "No user id";
  console.debug(encodeURIComponent(safeUserId));

  isLoading.value = true;

  try {

    result.value = await getQuest(safeUserId, questId);
    console.debug(`[Edit Quest Page][getQuest]${result.value}`);

    if (result.value) {

      rank.value = result.value.rank
      title.value = result.value.title
      description.value = result.value.description ?? "No Description"
      acceptanceCriteria.value = result.value.acceptanceCriteria ?? "No Acceptance Criteria"
      tags.value = result.value.tags
    }


  } catch (e) {
    console.error(e);
    error.value = "[Edit Quest Page] Failed to load quest.";
  } finally {
    isLoading.value = false;
  }
});


const onSubmit = handleSubmit(async (values) => {

  const safeUserId = user.value?.sub || "No user id";

  console.log(values)

  try {
    const result = await updateQuest(safeUserId, questId, values);

    if (result) {
      submissionSuccess.value = true;
    } else {
      submissionError.value = "Submission failed. Please try again.";
    }
  } catch (err) {
    submissionError.value = "An unexpected error occurred.";
    console.error(err);
  }
});

</script>

<template>
  <NuxtLayout>

    <div class="max-w-4xl mx-auto p-6">

      <h1 class="text-3xl text-yellow-200 font-bold mb-6">Edit Quest</h1>

      <p v-if="submissionSuccess" class="text-green-500 text-sm mb-4">
        Quest updated successfully!
      </p>

      <p v-if="submissionError" class="mb-10 text-red-400">{{ submissionError }}</p>

      <form v-if="result" @submit.prevent="onSubmit" class="space-y-4">

        <div class="flex flex-col mb-6 w-1/3">

          <SelectRoot v-model="rank">
            <SelectTrigger id="rank-select"
              class="inline-flex min-w-[160px] items-center justify-between rounded px-[15px] text-sm leading-none h-[38px] gap-[5px] bg-white text-black hover:bg-stone-50 border shadow-sm focus:shadow-[0_0_0_2px] focus:shadow-green-500 outline-none"
              aria-label="Quest Tier">
              <SelectValue placeholder="Choose rank" />
              <Icon icon="radix-icons:chevron-down" class="h-4 w-4" />
            </SelectTrigger>

            <SelectPortal>
              <SelectContent class="min-w-[160px] bg-white rounded border shadow-sm z-[100]" :side-offset="5">
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

          <p v-if="errors.rank" class="text-red-400 text-sm mt-1">{{ errors.rank }}</p>
        </div>

        <div class="mb-10">

          <ComboboxRoot v-model="tags" multiple ignore-filter class="relative" @select="() => query = ''">
            <ComboboxAnchor
              class="w-1/2 inline-flex items-center justify-between rounded p-2 text-sm gap-2 bg-white text-black shadow hover:bg-stone-100 focus:shadow-[0_0_0_2px] focus:shadow-green-500 outline-none">

              <TagsInputRoot v-model="tags" delimiter="" class="flex gap-2 items-center flex-wrap">
                <TagsInputItem v-for="item in tags" :key="item" :value="item"
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

          <p class="mt-1 text-sm text-zinc-400">
            <span :class="(tags?.length || 0) > 5 ? 'text-red-500' : 'text-zinc-400'">
              {{ tags?.length || 0 }}
            </span>/5 language tags
          </p>
          <p v-if="(tags?.length || 0) > 5" class="text-sm text-red-500">
            You can only select up to 5 tags
          </p>
          <p v-if="errors.tags" class="text-red-400 text-sm mt-1">{{ errors.tags }}</p>
        </div>

        <div class="mt-10 mb-6">

          <label for="quest-title" class="block text-sm font-medium text-white mb-2">
            Quest Title
          </label>

          <Input id="quest-title" v-model="title" v-bind="titleAttrs"
            placeholder="Write a short, punchy title like 'Fix the broken login page'" class="w-full" />
          <p class="mt-1 text-sm text-zinc-400">
            <span :class="(title?.length || 0) > 100 ? 'text-red-500' : 'text-zinc-400'">
              {{ title?.length || 0 }}
            </span>/100 characters
          </p>
          <p v-if="errors.title" class="text-red-400 text-sm mt-1">{{ errors.title }}</p>
        </div>

        <div>
          <label for="quest-description" class="block text-sm font-medium text-white mb-2">
            Description - This is optional
          </label>
          <TextArea id="quest-description" v-model="description"
            placeholder="What needs to be done? Be as clear and helpful as possible." />
          <p class="mt-1 text-sm text-zinc-400">
            <span :class="(description?.length || 0) > 5000 ? 'text-red-500' : 'text-zinc-400'">
              {{ description?.length || 0 }}
            </span>/5000 characters
          </p>
          <p v-if="errors.description" class="text-red-400 text-sm mt-1">{{ errors.description }}</p>
        </div>

        <div>
          <label for="acceptance-criteria" class="block text-sm font-medium text-white mb-2">
            Acceptance Criteria
          </label>
          <TextArea id="acceptance-criteria" v-model="acceptanceCriteria"
            placeholder="Add acceptance criteria to help guide devs to achieve the goal." />
          <p class="mt-1 text-sm text-zinc-400">
            <span :class="(acceptanceCriteria?.length || 0) > 5000 ? 'text-red-500' : 'text-zinc-400'">
              {{ acceptanceCriteria?.length || 0 }}
            </span>/5000 characters
          </p>
          <p v-if="errors.acceptanceCriteria" class="text-red-400 text-sm mt-1">{{ errors.acceptanceCriteria }}</p>
        </div>

        <div>
          <button type="submit" class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded"
            :disabled="isSubmitting">
            Update Quest
          </button>
        </div>
      </form>
    </div>
  </NuxtLayout>
</template>
