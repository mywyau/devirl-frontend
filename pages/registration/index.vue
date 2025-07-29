<script setup lang="ts">
import { Button } from '@/components/old/button';

import Input from '@/components/reka/Input.vue';
import { useAuthUser } from '@/composables/useAuthUser';
import { submitRegisterUser } from '@/controllers/RegistrationController';
import { ErrorsResponseSchema } from "@/types/schema/ErrorResponseSchema";
import { userRegistrationSchema, type UserRegistrationForm } from '@/types/schema/UserRegistration';
import { toTypedSchema } from '@vee-validate/zod';
import { useRouter } from 'nuxt/app';
import { useForm } from 'vee-validate';
import { ref } from 'vue';

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui';

import { Icon } from '@iconify/vue';

const router = useRouter();
const { data: user } = useAuthUser();

const {
  handleSubmit,
  defineField,
  errors,
  isSubmitting,
  setFieldError,
  setErrors,
} = useForm<UserRegistrationForm>({
  validationSchema: toTypedSchema(userRegistrationSchema),
});

const [username, usernameAttrs] = defineField('username');
const [firstName, firstNameAttrs] = defineField('firstName');
const [lastName, lastNameAttrs] = defineField('lastName');
const [userType, userTypeAttrs] = defineField('userType');

const registrationError = ref('');
const registrationSuccess = ref(false);

// backend error code based messages
const userFriendlyMessages: Record<string, string> = {
  DUPLICATE: 'This username is already taken. Please choose another.',
  DATA_TOO_LONG: 'This value is too long. Please shorten it.',
  VALIDATION_ERROR: 'There was a validation problem. Please check your input.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
};

const userTypeOptions = [
  { value: "Client", label: "Client" },
  { value: "Dev", label: "Dev" },
];

const onSubmit = handleSubmit(async (values) => {

  registrationError.value = '';
  registrationSuccess.value = false;

  const result = await submitRegisterUser(user.value?.sub, values);

  if (result.success) {
    registrationSuccess.value = true;
    await router.push('/');
  } else if (result.status === 400 && ErrorsResponseSchema.safeParse(result.structuredErrors).success) {
    const parsedErrors = ErrorsResponseSchema.parse(result.structuredErrors);

    let hasFieldLevelError = false;

    for (const err of parsedErrors) {
      if (err.column) {
        setFieldError(err.column as keyof UserRegistrationForm, userFriendlyMessages[err.code] || err.message);
        hasFieldLevelError = true;
      }
    }

    if (!hasFieldLevelError) {
      // fallback to show all messages globally
      registrationError.value = parsedErrors
        .map((e) => userFriendlyMessages[e.code] || e.message)
        .join(" ");
    }
  } else {
    registrationError.value = result.error || 'Something went wrong. Please try again.';
  }
});
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

        <form @submit.prevent="onSubmit" class="space-y-6">

          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-white">Username</label>
            <Input id="username" v-model="username" v-bind="usernameAttrs" class="w-full" />
            <p class="text-sm text-zinc-300">Max 20 characters</p>
            <p v-if="errors.username" class="text-sm text-red-500">{{ errors.username }}</p>

            <label for="firstname" class="block text-sm font-medium text-white">First Name</label>
            <Input id="firstname" v-model="firstName" v-bind="firstNameAttrs" class="w-full" />
            <p class="text-sm text-zinc-300">Max 50 characters</p>
            <p v-if="errors.firstName" class="text-sm text-red-500">{{ errors.firstName }}</p>

            <label for="lastname" class="block text-sm font-medium text-white">Last Name</label>
            <Input id="lastname" v-model="lastName" v-bind="lastNameAttrs" class="w-full" />
            <p class="text-sm text-zinc-300">Max 50 characters</p>
            <p v-if="errors.lastName" class="text-sm text-red-500">{{ errors.lastName }}</p>
          </div>

          <div class="flex flex-col space-y-2">

            <label for="role-select" class="text-sm font-medium text-white">Select Your Role</label>

            <SelectRoot v-model="userType">
              <SelectTrigger id="role-select"
                class="inline-flex min-w-[160px] items-center justify-between rounded px-[15px] text-sm leading-none h-[40px] gap-[5px] bg-white text-black hover:bg-stone-50 border shadow-sm focus:shadow-[0_0_0_2px] focus:shadow-green-500 outline-none"
                aria-label="User Type">
                <SelectValue placeholder="Choose User Type" />
                <Icon icon="radix-icons:chevron-down" class="h-4 w-4" />
              </SelectTrigger>

              <SelectPortal>
                <SelectContent class="min-w-[160px] bg-white rounded border shadow-sm z-[100]" :side-offset="5">
                  <SelectScrollUpButton
                    class="flex items-center justify-center h-[25px] bg-white text-black cursor-default">
                    <Icon icon="radix-icons:chevron-up" />
                  </SelectScrollUpButton>

                  <SelectViewport class="p-[5px]">
                    <SelectLabel class="px-4 text-xs font-medium text-zinc-500 mb-1">User Type</SelectLabel>
                    <SelectGroup>
                      <SelectItem v-for="option in userTypeOptions" :id="`user-type-option-${option.value}`"
                        :key="option.value" :value="option.value"
                        class="text-sm leading-none text-black rounded flex items-center h-[30px] pr-[35px] pl-[25px] relative select-none data-[highlighted]:bg-green-100 data-[highlighted]:text-black">
                        <SelectItemIndicator class="absolute left-0 w-[25px] inline-flex items-center justify-center">
                          <Icon icon="radix-icons:check" />
                        </SelectItemIndicator>
                        <SelectItemText>{{ option.label }}</SelectItemText>
                      </SelectItem>
                    </SelectGroup>
                  </SelectViewport>

                  <SelectScrollDownButton
                    class="flex items-center justify-center h-[25px] bg-white text-black cursor-default">
                    <Icon icon="radix-icons:chevron-down" />
                  </SelectScrollDownButton>
                </SelectContent>
              </SelectPortal>
            </SelectRoot>

            <p v-if="errors.userType" class="text-sm text-red-500">{{ errors.userType }}</p>
          </div>


          <Button type="submit" :disabled="isSubmitting" class="w-full bg-green-500 text-white hover:bg-green-400">
            Continue
          </Button>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>
