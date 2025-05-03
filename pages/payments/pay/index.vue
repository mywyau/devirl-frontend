<script setup lang="ts">
import { ref } from "vue";
import { usePayments } from "~/composables/usePayments";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "~/components/ui/button/variants";

const { createUpfrontPayment } = usePayments();

const taskId = "task_abc123"; // In real app, dynamically pass this
const amount = 5000; // $50

const isLoading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const handlePayment = async () => {
  successMessage.value = "";
  errorMessage.value = "";
  isLoading.value = true;

  try {
    const result = await createUpfrontPayment(taskId, amount);
    console.log("Payment created:", result);

    successMessage.value = "Payment initiated successfully! 🎉";
    // Optionally, redirect to Stripe checkout or show payment confirmation
  } catch (error) {
    console.error("Payment failed:", error);
    errorMessage.value = "Payment failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <NuxtLayout>
    <div class="">
      <div class="p-6 max-w-5xl mx-auto text-white">
        <div
          v-if="successMessage"
          class="text-green-600 text-center mt-2 mb-6 font-medium"
        >
          {{ successMessage }}
        </div>

        <div
          v-if="errorMessage"
          class="text-red-600 text-center mt-2 mb-6 font-medium"
        >
          {{ errorMessage }}
        </div>

        <Card class="bg-white/5 border-white/10 text-white">
          <CardContent class="p-6 space-y-6">
            <div>
              <h1 class="text-4xl font-extrabold tracking-tight mb-1">
                Make a Payment
              </h1>
              <p class="text-gray-400 text-base">Task ID: {{ taskId }}</p>
              <p
                class="text-xl font-semibold text-green-500 mt-6 mb-4 text-base"
              >
                $50.00
              </p>
            </div>

            <Separator />

            <div class="flex flex-wrap gap-3">
              <NuxtLink
                to="/payments/success"
              >
                <Button
                  variant="default"
                  class="capitalize text-white justify-center font-bold py-3 px-6 rounded-lg transition"
                >
                   Pay Upfront
                </Button>
              </NuxtLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </NuxtLayout>
</template>
