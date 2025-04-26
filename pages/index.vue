<script setup lang="ts">
import { Button } from '~/components/ui/button/variants'
</script>

<template>
  <NuxtLayout>
    <div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen flex items-center justify-center px-6">
      <div class="max-w-2xl text-center space-y-6">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome to Dev Irl</h1>
        <p class="text-gray-300 text-lg">
          Discover quests, earn rewards, and connect with developers and clients.
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <NuxtLink to="/quests">
            <Button class="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-white">
              Explore Quests
            </Button>
          </NuxtLink>

          <NuxtLink to="/quests/new">
            <Button variant="secondary" class="w-full sm:w-auto">
              Post a Quest
            </Button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
