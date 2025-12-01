<script setup lang="ts">
import { ref } from 'vue'

const rank = ref('')
const title = ref('')
const clientId = ref('')
const description = ref('')
const acceptanceCriteria = ref('')

async function createQuest() {
  const res = await $fetch('http://localhost:8091/devirl-quest-service/quest/create/user001', {
    method: 'POST',
    body: {
      rank: "Demonic",
      title: title.value,
      description: description.value,
      acceptanceCriteria: acceptanceCriteria.value,
      tags: ["Java"]
    }
  })

  console.log('Quest created:', res)
}
</script>

<template>
  <div class="p-10 max-w-xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Create Quest</h1>

    <form @submit.prevent="createQuest" class="flex flex-col gap-4">
      <input class="border p-2" v-model="title" placeholder="Title" />
      <textarea class="border p-2" v-model="description" placeholder="Description"></textarea>
      <textarea class="border p-2" v-model="acceptanceCriteria" placeholder="Acceptance Criteria"></textarea>

      <button class="px-4 py-2 bg-blue-600 text-white rounded">Create Quest</button>
    </form>
  </div>
</template>
