<script setup lang="ts">
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'reka-ui';

import { Button } from "@/components/ui/button/variants";


defineProps<{
  title: string;
  description: string;
  triggerText: string;
  actionText?: string;
  disabled?: boolean;
  actionConfirmId?: string;
  triggerClass?: string;
  actionClass?: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();
</script>

<template>
  <AlertDialogRoot>
    <AlertDialogTrigger as-child>

      <Button variant="default" :class="triggerClass" :disabled="disabled">
        {{ triggerText }}
      </Button>
      
    </AlertDialogTrigger>

    <AlertDialogPortal>
      <AlertDialogOverlay class="bg-black/50 fixed inset-0 z-30" />
      <AlertDialogContent
        class="z-[100] fixed top-[50%] left-[50%] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg sm:px-6 px-4">
        <AlertDialogTitle class="text-lg font-semibold text-black">
          {{ title }}
        </AlertDialogTitle>
        <AlertDialogDescription class="mt-2 text-sm text-gray-700">
          {{ description }}
        </AlertDialogDescription>

        <div class="flex justify-end gap-4 mt-6">
          <AlertDialogAction 
            :id="actionConfirmId || 'confirm-button'"
            :class="actionClass || 'bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-medium'"
            @click="emit('confirm')">
            {{ actionText || 'Confirm' }}
          </AlertDialogAction>
          <AlertDialogCancel 
            id="cancel-button"
            class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm font-medium">
            Cancel
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
