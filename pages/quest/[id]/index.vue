<script setup lang="ts">
import { deleteQuest, getQuest } from "@/controllers/QuestBackendController";
import { QuestPartialSchema, type QuestPartial } from "@/types/schema/QuestStatusSchema";
import { Button } from "~/components/ui/button/variants";
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useAuthUser } from "~/composables/useAuthUser";

const route = useRoute();
const questId = route.params.id as string;

const { user, userError } = await useAuthUser();
const safeUserId = user.value?.sub || "No user id";

const result = ref<QuestPartial | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);
const showError = ref(false);

async function handleDeleteQuest() {
  try {
    await deleteQuest(safeUserId, questId);
    success.value = true;
  } catch (err) {
    showError.value = true;
    console.error(err);
  }
}

onMounted(async () => {
  isLoading.value = true;
  try {
    const rawData = await getQuest(safeUserId, questId);
    const parsed = QuestPartialSchema.safeParse(rawData);

    if (!parsed.success) {
      console.error("[QuestPage] Invalid quest data", parsed.error);
      error.value = "Invalid quest data received.";
    } else {
      result.value = parsed.data;
    }
  } catch (e) {
    console.error(e);
    error.value = "Failed to load quest.";
  } finally {
    isLoading.value = false;
  }
});
</script>


<template>
  <NuxtLayout>
    <div class="p-6 max-w-4xl mx-auto text-white">
      <h1 class="text-3xl font-bold mb-6">Quest Details</h1>

      <div v-if="isLoading" class="text-gray-400">Loading quest...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div
        v-else
        class="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10 shadow"
      >
        <h2 class="text-2xl font-semibold text-indigo-300 mb-2">
          {{ result?.title }}
        </h2>
        <p class="mb-4 text-gray-300">{{ result?.description }}</p>

        <div>
          <span class="font-semibold">Status: </span>
          <span class="text-yellow-300 capitalize">{{
            result?.status.toString()
          }}</span>
        </div>

        <div class="mt-6 flex gap-4">
          <NuxtLink :to="`/client/quest/edit/${questId}`">
            <Button
              variant="secondary"
              class="bg-yellow-500 text-white rounded hover:bg-yellow-400"
            >
              Edit quest
            </Button>
          </NuxtLink>

          <Button
            variant="secondary"
            class="bg-red-600 text-white rounded hover:bg-red-500"
            @click="handleDeleteQuest"
          >
            Delete quest
          </Button>
        </div>

        <p v-if="success" class="text-green-500 text-sm pt-4">
          Quest Deleted successfully!
        </p>

        <p v-if="showError" class="text-red-500 text-sm">
          Delete quest unsuccessful!
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>
