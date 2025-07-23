<script setup lang="ts">

import { useAuthUser } from "@/composables/useAuthUser";
import { createQuest } from "@/controllers/QuestController";
import { CreateQuestSchema } from "@/types/schema/QuestStatusSchema";
import { languageFormatter, languageOptions } from "@/utils/HiscoresUtils";
import { rankOptions } from "@/utils/QuestRankUtil";
import { computed, ref, watch } from "vue";

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

const query = ref('')
const { contains } = useFilter({ sensitivity: 'base' })


const filteredOptions = computed(() =>
  languageOptions.filter(
    (option) =>
      contains(option, query.value) &&
      !questCreatePayload.value.tags.includes(option)
  )
)

const questCreatePayload = ref<CreateQuestSchema>(
  {
    rank: "",
    title: "",
    description: "",
    acceptanceCriteria: "",
    tags: [],
  }
);

const { data: user, error } = useAuthUser();


if (error.value) {
  console.error("Failed to load auth session:", error.value);
}

const isSubmitting = ref(false);
const submissionSuccess = ref(false);
const submissionError = ref<string | null>(null);


async function handleSubmit() {
  // ✅ Always clear error first
  submissionError.value = null;
  submissionSuccess.value = false;

  const payload = {
    ...questCreatePayload.value,
    tags: [...questCreatePayload.value.tags], // unwrap Proxy
  };


  console.log(payload)

  if (payload.tags.length === 0) {
    submissionError.value = "Please select at least one tag.";
    return;
  }

  isSubmitting.value = true;

  const userId = user.value?.sub;
  if (!userId) {
    submissionError.value = "User ID not available.";
    isSubmitting.value = false;
    return;
  }

  const parsed = CreateQuestSchema.safeParse(payload)


  if (!parsed.success) {
    submissionError.value = "Validation error: " + JSON.stringify(parsed.error.format());
    isSubmitting.value = false;
    return;
  } else {
    try {
      const result = await createQuest(userId, parsed.data);

      if (result) {
        submissionSuccess.value = true;
        questCreatePayload.value = {
          rank: "",
          title: "",
          description: "",
          acceptanceCriteria: "",
          tags: [],
        };
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

  watch(
    () => questCreatePayload.value.tags,
    () => {
      query.value = ''
    },
    { deep: true }
  )

}

</script>

<template>
  <NuxtLayout>

    <div class="p-6 max-w-4xl mx-auto">
      
      <h1 class="text-3xl text-green-300 font-bold mb-6">Create a New Quest</h1>

      <form @submit.prevent="handleSubmit" class="">

        <p v-if="submissionSuccess" class="mb-10 text-green-400">
          Quest created successfully!
        </p>

        <p v-if="submissionError" class="mb-10 text-red-400">{{ submissionError }}</p>

        <div class="flex flex-col mb-6 w-1/3">

          <label for="rank" class="text-sm font-medium text-white mb-2">Quest Tier</label>

          <SelectRoot v-model="questCreatePayload.rank">
            <SelectTrigger id="rank"
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

          <label class="text-sm text-white mb-2 block">Add Language Tags</label>

          <ComboboxRoot v-model="questCreatePayload.tags" multiple ignore-filter class="relative"
            @select="() => query = ''">
            <ComboboxAnchor
              class="w-1/2 inline-flex items-center justify-between rounded-lg p-2 text-sm gap-2 bg-white text-black shadow hover:bg-stone-100 focus:shadow-[0_0_0_2px] focus:shadow-green-500 outline-none">

              <TagsInputRoot v-model="questCreatePayload.tags" delimiter="" class="flex gap-2 items-center flex-wrap">
                <TagsInputItem v-for="item in questCreatePayload.tags" :key="item" :value="languageFormatter(item)"
                  class="flex items-center gap-2 text-white bg-green-600 rounded px-2 py-1">
                  <TagsInputItemText class="text-sm" />
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
          <label for="quest-title" class="block mb-1 text-sm font-medium text-white">
            Quest Title
          </label>

          <Input id="quest-title" v-model="questCreatePayload.title" placeholder="Add a title to your quest post"
            class="w-full" />

          <p class="mt-1 text-sm text-zinc-400">Max 100 characters</p>
        </div>

        <div class="mb-6">
          <label for="quest-description" class="block mb-1 text-sm font-medium text-white">
            Description (optional)
          </label>

          <TextArea id="quest-description" v-model="questCreatePayload.description"
            placeholder="What needs to be done? Be as clear and helpful as possible." />
        </div>

        <div class="mb-6">
          <label for="acceptance-criteria" class="block mb-1 text-sm font-medium text-white">
            Acceptance Criteria (required)
          </label>

          <TextArea id="acceptance-criteria" v-model="questCreatePayload.acceptanceCriteria"
            placeholder="Add acceptance criteria to help achieve the goal" />
        </div>

        <div class="mt-10">
          <button type="submit" class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded"
            :disabled="isSubmitting">
            Create Quest
          </button>
        </div>

      </form>

    </div>
  </NuxtLayout>
</template>
