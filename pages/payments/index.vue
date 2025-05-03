<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button/variants";

interface Payment {
  taskId: string;
  amount: number; // in cents
  status: 'pending' | 'succeeded' | 'failed';
}

const payments = ref<Payment[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  // TODO: Fetch real payments from backend
  setTimeout(() => {
    payments.value = [
      { taskId: "task_abc123", amount: 5000, status: "succeeded" },
      { taskId: "task_def456", amount: 3000, status: "pending" },
      { taskId: "task_ghi789", amount: 7000, status: "failed" },
    ];
    isLoading.value = false;
  }, 1000);
});

const formatAmount = (amount: number) => {
  return `$${(amount / 100).toFixed(2)}`;
};
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <div class="max-w-6xl w-full">
        <h1 class="text-4xl font-bold text-white mb-8">Your Payments</h1>

        <Card class="bg-white/5 border-white/10 text-white">
          <CardContent class="p-8">
            <div v-if="isLoading" class="text-center text-gray-400">
              Loading payments...
            </div>

            <div v-else>
              <div v-if="payments.length === 0" class="text-center text-gray-400">
                No payments found.
              </div>

              <div v-else class="space-y-4">
                <div v-for="payment in payments" :key="payment.taskId" class="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <div class="flex flex-col space-y-1">
                    <h2 class="text-lg font-semibold">{{ payment.taskId }}</h2>
                    <p class="text-gray-400 text-sm">
                      {{ formatAmount(payment.amount) }}
                    </p>
                  </div>

                  <div class="flex items-center gap-4 mt-4 md:mt-0">
                    <span
                      :class="{
                        'text-green-400': payment.status === 'succeeded',
                        'text-yellow-400': payment.status === 'pending',
                        'text-red-400': payment.status === 'failed'
                      }"
                      class="font-semibold capitalize"
                    >
                      {{ payment.status }}
                    </span>

                    <NuxtLink :to="`/payments/${payment.taskId}`">
                      <Button variant="secondary">
                        View
                      </Button>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </NuxtLayout>
</template>
