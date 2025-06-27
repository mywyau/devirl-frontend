<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  modelValue: string[];
  options: string[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

const search = ref("");

// Only show options not already selected and match the search
const filteredOptions = computed(() =>
  props.options.filter(
    (opt) =>
      opt.toLowerCase().includes(search.value.toLowerCase()) &&
      !props.modelValue.includes(opt)
  )
);

function toggleTag(tag: string) {
  if (props.modelValue.includes(tag)) {
    emit("update:modelValue", props.modelValue.filter((t) => t !== tag));
  } else if (props.modelValue.length < 5) {
    emit("update:modelValue", [...props.modelValue, tag]);
  }
}
</script>


<template>
  <div class="space-y-2">
    <input id="language-tag-selector" v-model="search" placeholder="Search languages..." class="w-full p-2 rounded border border-zinc-300" />

    <ul v-if="search.length > 0 && filteredOptions.length > 0"
      class="max-h-40 overflow-auto bg-white border border-zinc-200 rounded shadow">
      <li :id="`language-opt-${opt.toLowerCase()}`" v-for="opt in filteredOptions" :key="opt" @click="toggleTag(opt)"
        class="px-4 py-2 hover:bg-green-100 cursor-pointer">
        {{ opt }}
      </li>
    </ul>

    <div class="flex flex-wrap gap-2 mt-2">
      <span v-for="tag in modelValue" :key="tag"
        class="bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center gap-2">
        {{ tag }}
        <button @click="toggleTag(tag)" class="text-white font-bold">×</button>
      </span>
    </div>
  </div>
</template>
