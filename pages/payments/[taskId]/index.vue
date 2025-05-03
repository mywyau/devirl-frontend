<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button/variants";

// Simulate loading payment status (later connect to your API)
const route = useRoute();
const taskId = route.params.taskId as string;

const paymentStatus = ref<'pending' | 'succeeded' | 'failed'>('pending');
const amountPaid = ref(5000); // Cents → Example: 5000 = $50
const currency = ref('USD');

const isLoading = ref(true);

onMounted(async () => {
  // Later: Fetch real payment status from your backend
  // Example: const { data } = await useFetch(`/api/payments/${taskId}`)
  setTimeout(() => {
    paymentStatus.value = 'succeeded'; // Simulate "paid"
    isLoading.value = false;
  }, 1000);
});
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <Card class="bg-white/5 border-white/10 text-white max-w-2xl w-full">
        <CardContent class="p-8 space-y-8 flex flex-col">
          <div>
            <h1 class="text-3xl font-bold mb-2">Payment Details</h1>
            <p class="text-gray-400 text-sm">Task ID: {{ taskId }}</p>
          </div>

          <Separator />

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-400">Amount</span>
              <span class="text-xl font-semibold text-green-400">
                {{ (amountPaid / 100).toFixed(2) }} {{ currency }}
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-400">Status</span>
              <span
                v-if="isLoading"
                class="text-yellow-400 font-semibold"
              >
                Loading...
              </span>
              <span
                v-else-if="paymentStatus === 'succeeded'"
                class="text-green-400 font-semibold"
              >
                Paid ✅
              </span>
              <span
                v-else-if="paymentStatus === 'pending'"
                class="text-yellow-400 font-semibold"
              >
                Pending ⏳
              </span>
              <span
                v-else
                class="text-red-400 font-semibold"
              >
                Failed ❌
              </span>
            </div>
          </div>

          <Separator />

          <div class="flex justify-center">
            <NuxtLink to="/payments">
              <Button class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition w-full text-center">
                Return to Payments Dashboard
              </Button>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </NuxtLayout>
</template>
