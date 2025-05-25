<script setup lang="ts">
import { z } from "zod";
import { ref, onMounted } from "vue";
import ProfileItem from "@/components/ui/profile/ProfileItem";
import { updateUserType } from "@/controllers/RegistrationController";
import { useAuthUser } from "~/composables/useAuthUser";

import {
  UserDataSchema,
  UpdateUserTypeSchema,
} from "@/types/schema/UserDataSchema";
import type { UserData, UpdateUserType } from "@/types/schema/UserDataSchema";

import { Button } from "@/components/ui/button";
import { navigateTo } from "nuxt/app";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const role = ref("");
const userTypeSuccess = ref(false);
const userTypeError = ref("");

const { user, error } = await useAuthUser();
const safeUserId = user.value?.sub || "No user id";

const updateRole = async () => {
  userTypeError.value = "";

  try {
    const payload = {
      userType: role.value,
    };

    const parsed: UpdateUserType = UpdateUserTypeSchema.parse(payload);

    await updateUserType(safeUserId, parsed);
    userTypeSuccess.value = true;

    await $fetch("/api/auth/refresh-session", {
      method: "POST", // or GET if you prefer
      credentials: "include",
    });
    
    navigateTo("/");
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
    <div class="max-w-xl mx-auto mt-16 p-6 flex-1 rounded-2xl border shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-indigo-400">
        Complete Your Signup
      </h1>

      <div class="space-y-8">
        <form @submit.prevent="updateRole" class="space-y-4">
          <Select v-model="role">
            <SelectTrigger>
              <SelectValue placeholder="Select your role..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Client">Client</SelectItem>
              <SelectItem value="Dev">Dev</SelectItem>
            </SelectContent>
          </Select>
        </form>

        <div class="h-20" />

        <div class="mt-12">
          <Button @click="updateRole" class="w-full" :disabled="!role">
            Continue
          </Button>
        </div>
      </div>

      <p v-if="userTypeSuccess" class="text-green-500 mt-4 text-sm text-center">
        Signup successful!
      </p>

      <p v-if="userTypeError" class="text-red-500 mt-4 text-sm text-center">
        {{ userTypeError }}
      </p>
    </div>
  </NuxtLayout>
</template>
