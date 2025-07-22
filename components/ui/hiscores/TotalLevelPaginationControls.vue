<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot
} from 'reka-ui'

defineProps<{
  total: number
  page: number
  itemsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()
</script>

<template>
  <PaginationRoot
    :page="page"
    @update:page="emit('update:page', $event)"
    :total="total"
    :items-per-page="itemsPerPage"
    :sibling-count="1"
    show-edges
    class="my-6 flex justify-center"
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1 text-stone-700 dark:text-white">
      <PaginationFirst class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg">
        <Icon icon="radix-icons:double-arrow-left" />
      </PaginationFirst>
      <PaginationPrev class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg mr-4">
        <Icon icon="radix-icons:chevron-left" />
      </PaginationPrev>

      <template v-for="(item, index) in items" :key="index">
        <PaginationListItem
          v-if="item.type === 'page'"
          :value="item.value"
          class="w-9 h-9 rounded-lg data-[selected]:!bg-white data-[selected]:text-black data-[selected]:shadow-sm hover:bg-white dark:hover:bg-stone-500/70 transition"
        >
          {{ item.value }}
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          :index="index"
          class="w-9 h-9 flex items-center justify-center"
        >
          &hellip;
        </PaginationEllipsis>
      </template>

      <PaginationNext class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg ml-4">
        <Icon icon="radix-icons:chevron-right" />
      </PaginationNext>
      <PaginationLast class="w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-stone-700/70 rounded-lg">
        <Icon icon="radix-icons:double-arrow-right" />
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>
