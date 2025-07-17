<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const username = route.params.username as string

const devProfile = ref({
  username,
  email: 'dev@example.com',
  mobile: '555-1234',
  skillData: [
    { skill: 'questing', level: 54, xp: 23000 },
    { skill: 'estimating', level: 42, xp: 15000 },
  ],
  languageData: [
    { language: 'Scala', level: 40, xp: 12000 },
    { language: 'TypeScript', level: 37, xp: 10500 },
  ]
})

// Later you will replace this mock with an API call like:
// const res = await fetch(`/api/profile/dev/${username}`)
</script>

<template>
  <NuxtLayout>
    <div class="max-w-4xl mx-auto px-4 py-10 text-white">
      <h1 class="text-3xl font-semibold mb-6">Developer Profile</h1>

      <div class="mb-6">
        <p><strong>Username:</strong> {{ devProfile.username }}</p>
        <p><strong>Email:</strong> {{ devProfile.email }}</p>
        <p><strong>Mobile:</strong> {{ devProfile.mobile }}</p>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-2">Skills</h2>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="s in devProfile.skillData" :key="s.skill">
            {{ s.skill }} - Level {{ s.level }} ({{ s.xp.toLocaleString() }} XP)
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl font-semibold mb-2">Languages</h2>
        <ul class="list-disc list-inside space-y-1">
          <li v-for="l in devProfile.languageData" :key="l.language">
            {{ l.language }} - Level {{ l.level }} ({{ l.xp.toLocaleString() }} XP)
          </li>
        </ul>
      </div>
    </div>
  </NuxtLayout>
</template>
