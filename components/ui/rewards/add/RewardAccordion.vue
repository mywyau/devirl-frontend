<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui';

defineProps<{
    items: {
        title: string;
        content: string;
        value: string;
    }[];
}>();
</script>


<template>
    <AccordionRoot class="rounded-lg border border-zinc-700 bg-zinc-900 mb-6" type="multiple" :collapsible="true">
        <AccordionItem v-for="item in items" :key="item.value" :value="item.value" class="border-b border-zinc-700">
            <AccordionHeader class="flex">
                <AccordionTrigger
                    class="flex h-[48px] flex-1 items-center justify-between px-4 text-sm font-semibold text-emerald-300 bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 group">
                    <span>{{ item.title }}</span>
                    <Icon icon="radix-icons:chevron-down"
                        class="text-emerald-300 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent class="bg-zinc-800 text-zinc-300 text-sm">
                <div class="px-4 py-3">{{ item.content }}</div>
            </AccordionContent>
        </AccordionItem>
    </AccordionRoot>
</template>
