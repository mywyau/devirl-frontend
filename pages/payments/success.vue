<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button/variants";
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <Card class="bg-white/5 border-white/10 text-white max-w-md w-full">
        <CardContent class="p-8 space-y-8 flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>

          <h1 class="text-3xl font-bold text-center">
            Payment Successful 🎉
          </h1>

          <p class="text-center text-gray-400">
            Thank you for your payment! Your task bounty is now secured.
          </p>

          <NuxtLink to="/">
            <Button class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition w-full text-center">
              Return to Dashboard
            </Button>
          </NuxtLink>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
