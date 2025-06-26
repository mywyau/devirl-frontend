<script setup lang="ts">

import { useAuthUser } from "@/composables/useAuthUser";
import { ref } from "vue";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { submitUserTypeUpdate } from "@/controllers/RegistrationController";

const userTypeForm = ref({
  username: "",
  userType: "",
});

const userTypeSuccess = ref(false);
const userTypeError = ref("");

const { data: user } = useAuthUser();

const updateRole = async () => {

  userTypeError.value = "";
  userTypeSuccess.value = false;

  const safeUserId = user.value?.sub;

  const result = await submitUserTypeUpdate(safeUserId, userTypeForm.value);

  if (result.success) {
    userTypeSuccess.value = true;
  } else {
    userTypeError.value = result.error || "Error when submitting registration details";
  }
};

</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white/20 rounded-2xl shadow-lg p-8 space-y-6">
        <h1 class="text-3xl font-semibold text-center text-teal-400">
          Complete Your Signup
        </h1>

        <div v-if="userTypeError" class="text-red-600 text-sm text-center">
          {{ userTypeError }}
        </div>
        <div v-else-if="userTypeSuccess" class="text-green-600 text-sm text-center">
          Role updated successfully!
        </div>

        <form @submit.prevent="updateRole" class="space-y-6">

          <div>
            <label for="username" class="block mb-1 text-sm font-medium text-white">
              Username
            </label>
            <!-- Username input -->
            <input id="username" v-model="userTypeForm.username" type="text" required placeholder="Create your username"
              class="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400" />
            <p class="mt-1 text-sm text-zinc-400">Max 20 characters</p>
          </div>

          <div class="flex flex-col space-y-2">
            <label for="role-select" class="text-sm font-medium text-white">
              Select Your Role
            </label>

            <Select v-model="userTypeForm.userType">
              <!-- Give the trigger a stable test ID -->
              <SelectTrigger id="role-select" data-testid="role-select-trigger"
                class="w-full flex justify-between items-center rounded-lg border border-green-400 bg-white px-4 py-2 text-sm text-black focus:outline-none focus:ring-3 focus:ring-green">
                <SelectValue placeholder="Choose one…" />
              </SelectTrigger>

              <SelectContent data-testid="role-select-content"
                class="w-full bg-white rounded-lg border border-zinc-400">
                <SelectLabel class="px-4 py-2 text-xs font-medium text-zinc-500">
                  Roles
                </SelectLabel>
                <SelectItem value="Client" data-testid="role-select-item-Client"
                  class="w-full px-4 py-2 text-black hover:bg-zinc-100">
                  Client
                </SelectItem>
                <SelectItem value="Dev" data-testid="role-select-item-Dev"
                  class="w-full px-4 py-2 text-black hover:bg-zinc-100">
                  Dev
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" :disabled="!userTypeForm.username || !userTypeForm.userType"
            class="w-full bg-green-500 hover:bg-green-400 disabled:bg-zinc-300 disabled:text-zinc-800 text-white">
            Continue
          </Button>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>
