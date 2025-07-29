<script setup lang="ts">
import { useAuthUser } from "@/composables/useAuthUser";
import { userRegistrationSchema, type UserRegistrationForm } from "@/types/schema/UserRegistration";
import { ref } from "vue";

import { Button } from "@/components/old/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/old/select";

import Input from '@/components/reka/Input.vue';
import { submitRegisterUser } from "@/controllers/RegistrationController";
import { useRouter } from "nuxt/app";

const userTypeForm = ref<UserRegistrationForm>({
  username: "",
  firstName: "",
  lastName: "",
  userType: "" as any,
});

const router = useRouter()
const registrationSuccess = ref(false);
const registrationError = ref("");
const validationErrors = ref<Partial<Record<keyof UserRegistrationForm, string>>>({});

const { data: user } = useAuthUser();

const registerUser = async () => {
  registrationError.value = "";
  registrationSuccess.value = false;
  validationErrors.value = {};

  const parseResult = userRegistrationSchema.safeParse(userTypeForm.value);

  if (!parseResult.success) {
    for (const issue of parseResult.error.issues) {
      const field = issue.path[0] as keyof UserRegistrationForm;
      validationErrors.value[field] = issue.message;
    }
    return;
  }

  const safeUserId = user.value?.sub;
  const result = await submitRegisterUser(safeUserId, userTypeForm.value);

  if (result.success) {
    registrationSuccess.value = true;
    await router.push('/')
  } else {
    registrationError.value = result.error || "Error when submitting registration details";
  }
};

</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white/20 rounded-2xl shadow-lg p-8 space-y-6">

        <h1 class="text-3xl font-semibold text-center text-teal-300">
          Complete Your Signup
        </h1>

        <div v-if="registrationError" class="text-red-600 text-sm text-center">
          {{ registrationError }}
        </div>
        <div v-else-if="registrationSuccess" class="text-green-600 text-sm text-center">
          Registration Successful
        </div>

        <form @submit.prevent="registerUser" class="space-y-6">

          <div class="space-y-2">

            <label for="username" class="block text-sm font-medium text-white">
              Username
            </label>

            <p v-if="validationErrors.username" class="text-sm text-red-500">
              {{ validationErrors.username }}
            </p>

            <Input id="username" v-model="userTypeForm.username" placeholder="Username" class="w-full" />
            <p class="mt-1 text-sm text-zinc-400">Max 20 characters</p>

            <label for="firstname" class="block text-sm font-medium text-white">
              First Name
            </label>
            <p v-if="validationErrors.firstName" class="text-sm text-red-500">
              {{ validationErrors.firstName }}
            </p>
            <Input id="firstname" v-model="userTypeForm.firstName" placeholder="First Name" class="w-full" />
            <p class="mt-1 text-sm text-zinc-400">Max 50 characters</p>


            <label for="lastname" class="block text-sm font-medium text-white">
              Last Name
            </label>
            <p v-if="validationErrors.lastName" class="text-sm text-red-500">
              {{ validationErrors.lastName }}
            </p>
            <Input id="lastname" v-model="userTypeForm.lastName" placeholder="Last Name" class="w-full" />
            <p class="mt-1 text-sm text-zinc-400">Max 50 characters</p>

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
