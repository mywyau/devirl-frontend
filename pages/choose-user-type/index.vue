<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useAuthUser } from "~/composables/useAuthUser";
import { updateUserType } from "@/controllers/RegistrationController";

import type { UpdateUserType } from "@/types/schema/UserDataSchema";
import { UpdateUserTypeSchema } from "@/types/schema/UserDataSchema";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";

const role = ref<string>("");
const userTypeSuccess = ref(false);
const userTypeError = ref("");

const { data: user } = useAuthUser();

const updateRole = async () => {
  userTypeError.value = "";
  userTypeSuccess.value = false;

  const safeUserId = user.value?.sub;
  if (!safeUserId) {
    userTypeError.value = "User ID is missing. Please log in again.";
    return;
  }

  try {
    const payload: UpdateUserType = UpdateUserTypeSchema.parse({ userType: role.value });
    await updateUserType(safeUserId, payload);

    userTypeSuccess.value = true;

    // Refresh server session so role changes propagate
    await $fetch("/api/auth/refresh-session", {
      method: "POST",
      credentials: "include",
    });
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      userTypeError.value = e.errors.map((err) => err.message).join(", ");
    } else {
      userTypeError.value = e.data?.message || "Something went wrong";
    }
  }
};
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white rounded-2xl border border-zinc-300 shadow-lg p-8 space-y-6">
        <h1 class="text-3xl font-semibold text-center text-black">
          Complete Your Signup
        </h1>

        <div v-if="userTypeError" class="text-red-600 text-sm text-center">
          {{ userTypeError }}
        </div>
        <div v-else-if="userTypeSuccess" class="text-green-600 text-sm text-center">
          Role updated successfully!
        </div>

        <form @submit.prevent="updateRole" class="space-y-6">
          <div class="flex flex-col space-y-2">
            <label for="role-select" class="text-sm font-medium text-black">
              Select Your Role
            </label>

            <Select v-model="role">
              <!-- Give the trigger a stable test ID -->
              <SelectTrigger
                id="role-select"
                data-testid="role-select-trigger"
                class="w-full flex justify-between items-center rounded-lg border border-zinc-400 bg-white px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
              >
                <SelectValue placeholder="Choose one…" />
              </SelectTrigger>

              <SelectContent
                data-testid="role-select-content"
                class="w-full bg-white rounded-lg border border-zinc-400"
              >
                <SelectLabel class="px-4 py-2 text-xs font-medium text-zinc-500">
                  Roles
                </SelectLabel>
                <SelectItem
                  value="Client"
                  data-testid="role-select-item-Client"
                  class="w-full px-4 py-2 text-black hover:bg-zinc-100"
                >
                  Client
                </SelectItem>
                <SelectItem
                  value="Dev"
                  data-testid="role-select-item-Dev"
                  class="w-full px-4 py-2 text-black hover:bg-zinc-100"
                >
                  Dev
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            :disabled="!role"
            class="w-full bg-black hover:bg-zinc-800 disabled:bg-zinc-300 disabled:text-zinc-600 text-white"
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>
