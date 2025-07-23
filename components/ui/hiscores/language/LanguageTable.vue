<script setup lang="ts">
import type { LanguageData } from '@/types/schema/LangaugeSchema';
import {
    ScrollAreaRoot,
    ScrollAreaViewport,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
} from 'reka-ui';

const props = defineProps<{
    pagedData: LanguageData[];
    itemsPerPage: number;
    currentPage: number;
}>();
</script>

<template>

    <ScrollAreaRoot class="w-full mb-10 relative" style="--scrollbar-size: 8px" type="auto">
        
        <ScrollAreaViewport class="w-full">
            <table 
            class="w-full min-w-[500px] table-auto text-left border-collapse"
            :class="{
                'min-w-[300px]': true,      
                'md:min-w-[500px]': true    
            }"
            >
                <thead class="border-b border-white/10 text-white">
                    <tr class="text-base md:text-lg"> <!-- bump font-size on mobile -->
                        <th class="py-2">Rank</th>
                        <th class="py-2">Username</th>
                        <th class="py-2">Level</th>
                        <th class="py-2">XP</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(dev, i) in pagedData" :key="`${dev.devId}-${dev.language}`"
                        class="border-b border-white/5 text-white">
                        <td class="py-2">{{ (currentPage - 1) * itemsPerPage + i + 1 }}</td>
                        <td class="py-2 text-indigo-300">{{ dev.username }}</td>
                        <td class="py-2">{{ dev.level }}</td>
                        <td class="py-2">{{ dev.xp.toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>
        </ScrollAreaViewport>


        <ScrollAreaScrollbar orientation="horizontal" class="flex select-none touch-none p-0.5 bg-white/10 hover:bg-white/20 transition-colors duration-150 ease-out data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5">
            <ScrollAreaThumb class="flex-1 bg-white/60 rounded-full" />
        </ScrollAreaScrollbar>
    </ScrollAreaRoot>
</template>
