<script setup lang="ts">
import { Icon } from '@iconify/vue';
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
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    SelectViewport
} from 'reka-ui';

import { languageFormatter, languageOptions, skillOptions } from '@/utils/HiscoresUtils';
import { useRouter } from 'vue-router';

const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const router = useRouter()

function handleChange(val: string) {
    emit('update:modelValue', val)
    router.push(`/hiscores/${val}`)
}

</script>

<template>
    <div class="block lg:hidden mb-4 px-2">

        <SelectRoot :model-value="modelValue" @update:modelValue="handleChange">
            <SelectTrigger
                class="inline-flex w-full items-center justify-between rounded px-4 py-2 text-white bg-zinc-800 border border-zinc-600 shadow-sm text-sm"
                aria-label="Select view">
                <SelectValue placeholder="Select Hiscore..." />
                <Icon icon="radix-icons:chevron-down" class="h-4 w-4" />
            </SelectTrigger>

            <SelectPortal>
                <SelectContent class="w-full min-w-[200px] bg-white text-black rounded shadow-lg z-50">
                    <SelectScrollUpButton class="flex items-center justify-center h-[25px] bg-white text-zinc-500">
                        <Icon icon="radix-icons:chevron-up" />
                    </SelectScrollUpButton>

                    <SelectViewport class="p-1">

                        <SelectGroup>
                            <SelectLabel class="px-4 text-xs text-zinc-500">Overview</SelectLabel>
                            <SelectItem :value="'total-level'" class="px-4 py-2 text-sm hover:bg-teal-100 rounded">
                                <SelectItemIndicator class="mr-2">
                                    <Icon icon="radix-icons:check" />
                                </SelectItemIndicator>
                                <SelectItemText>Total Level</SelectItemText>
                            </SelectItem>
                        </SelectGroup>


                        <SelectSeparator class="my-1 h-px bg-gray-200" />


                        <SelectGroup>
                            <SelectLabel class="px-4 text-xs text-zinc-500">Skills</SelectLabel>
                            <SelectItem v-for="skill in skillOptions" :key="skill" :value="`skills/${skill}`"
                                class="px-4 py-2 text-sm hover:bg-teal-100 rounded">
                                <SelectItemIndicator class="mr-2">
                                    <Icon icon="radix-icons:check" />
                                </SelectItemIndicator>
                                <SelectItemText>{{ skill.charAt(0).toUpperCase() + skill.slice(1) }}</SelectItemText>
                            </SelectItem>
                        </SelectGroup>

                        <SelectSeparator class="my-1 h-px bg-gray-200" />

                        <SelectGroup>
                            <SelectLabel class="px-4 text-xs text-zinc-500">Languages</SelectLabel>
                            <SelectItem v-for="lang in languageOptions" :key="lang"
                                :value="`languages/${encodeURIComponent(lang)}`"
                                class="px-4 py-2 text-sm hover:bg-teal-100 rounded">
                                <SelectItemIndicator class="mr-2">
                                    <Icon icon="radix-icons:check" />
                                </SelectItemIndicator>
                                <SelectItemText>{{ languageFormatter(lang) }}</SelectItemText>
                            </SelectItem>
                        </SelectGroup>

                    </SelectViewport>

                    <SelectScrollDownButton class="flex items-center justify-center h-[25px] bg-white text-zinc-500">
                        <Icon icon="radix-icons:chevron-down" />
                    </SelectScrollDownButton>
                </SelectContent>
            </SelectPortal>
        </SelectRoot>
    </div>
</template>
