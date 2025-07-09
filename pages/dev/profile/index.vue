<script setup lang="ts">
import { Button } from "@/components/ui/button/variants";
import ProfileItem from "@/components/ui/profile/ProfileItem";
import { loadConfig } from '@/configuration/ConfigLoader';
import { deleteUser, getUser } from "@/controllers/UserDataController";
import type { AuthUser } from "@/types/AuthUser";
import { DeleteResponseSchema, type DeleteResponse } from "@/types/schema/ApiResponses";
import { GetUserDataSchema, type GetUserData } from "@/types/schema/UserDataSchema";
import { useAsyncData, useFetch, useRequestHeaders } from "nuxt/app";
import { computed, ref } from "vue";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'reka-ui';

const config = loadConfig()
const baseUrl = `${config.devQuestBackend.baseUrl}/`

const headers: Record<string, string> | undefined = useRequestHeaders(["cookie"]);

const { data: authUser, error } = await useFetch<AuthUser | null>('/api/auth/session', {
  headers: headers,
  credentials: 'include',
  transform: (res: any) => res.user ?? null,
  default: () => null,
});

const userId = computed(() => authUser.value?.sub);


// Fetch profile using SSR-friendly asyncData
const { data: userProfile, error: userProfileError, pending: isLoading } =
  await useAsyncData<GetUserData | null>(
    "user-profile",
    async () => {
      if (!userId.value) return null;
      const raw = await getUser(userId.value, headers);
      const parsed = GetUserDataSchema.safeParse(raw);
      if (!parsed.success) throw new Error("Invalid user data");
      return parsed.data;
    }
  );

// Delete user logic (still client-only)
const deleteResponse = ref<DeleteResponse | null>(null);
const deleteError = ref("");
const isDeleting = ref(false);
const deleteSuccess = ref("");

async function handleDeleteUser() {
  deleteError.value = deleteSuccess.value = "";
  isDeleting.value = true;

  if (!userId.value) {
    deleteError.value = "User ID not found.";
    isDeleting.value = false;
    return;
  }

  try {
    const raw = await deleteUser(userId.value);
    const parsed = DeleteResponseSchema.safeParse(raw);
    if (!parsed.success) {
      deleteError.value = "Invalid server response.";
    } else {
      deleteSuccess.value = parsed.data.message || "User deleted.";
      deleteResponse.value = parsed.data;
    }
  } catch (e: any) {
    deleteError.value = e?.data?.message || "Failed to delete user.";
  } finally {
    isDeleting.value = false;
  }
}

async function startStripeOnboarding() {

  if (!userId.value) return;

  try {
    // this is scala backend route for onboarding
    const res = await $fetch(`${baseUrl}stripe/onboarding`, {
      method: "POST",
      body: { userId: userId.value },
    });

    if (res?.url) {
      window.location.href = res.url;
    } else {
      alert("Stripe onboarding failed to return a link.");
    }
  } catch (err) {
    console.error("Stripe onboarding error:", err);
    alert("Failed to start Stripe onboarding.");
  }
}


</script>

<template>
  <NuxtLayout>
    <div class="max-w-6xl mx-auto mt-16 px-4 md:px-6">
      <div class="font-sans grid grid-cols-1 md:grid-cols-2 gap-8">

        <!-- Profile Info Card -->
        <div class="p-6 rounded-2xl border border-zinc-700 shadow-lg">
          <h2 class="font-heading text-3xl font-bold text-white mb-6 text-center">Your Profile</h2>

          <div v-if="isLoading" class="text-white text-center">Loading...</div>

          <div v-else-if="userProfile">
            <div class="space-y-4">
              <ProfileItem label="First Name" labelColor="text-white" textColor="text-white"
                :value="userProfile.firstName" />
              <ProfileItem label="Last Name" labelColor="text-white" textColor="text-white"
                :value="userProfile.lastName" />
              <ProfileItem label="Email" :value="userProfile.email" labelColor="text-white" textColor="text-white" />
              <ProfileItem label="Username" :value="userProfile.username" labelColor="text-white"
                textColor="text-white" />
              <ProfileItem label="Role" :value="userProfile.userType ?? '—'" labelColor="text-white"
                textColor="text-white" />

              <!-- <Button variant="secondary" class="w-full mt-6 bg-red-600 text-white hover:bg-red-500"
                :disabled="isDeleting" @click="handleDeleteUser">
                {{ isDeleting ? "Deleting..." : "Delete user profile" }}
              </Button> -->

              <AlertDialogRoot>
                <AlertDialogTrigger as-child>
                  <Button variant="secondary" class="w-full mt-6 bg-red-600 text-white hover:bg-red-500"
                    :disabled="isDeleting">
                    {{ isDeleting ? "Deleting..." : "Delete user profile" }}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                  <AlertDialogOverlay class="bg-black/50 fixed inset-0 z-30" />
                  <AlertDialogContent
                    class="z-[100] fixed top-[50%] left-[50%] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg">
                    <AlertDialogTitle class="text-lg font-semibold text-black">
                      Confirm Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription class="mt-2 text-sm text-gray-700">
                      Are you sure you want to delete your profile? This action cannot be undone and all your data will
                      be removed.
                    </AlertDialogDescription>
                    <div class="flex justify-end gap-4 mt-6">
                      <AlertDialogCancel class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm font-medium">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-medium"
                        @click="handleDeleteUser">
                        Yes, delete my profile
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialogPortal>
              </AlertDialogRoot>


              <p v-if="deleteError" class="text-red-500 mt-4 text-center text-sm">{{ deleteError }}</p>
              <p v-if="deleteSuccess" class="text-green-500 mt-4 text-center text-sm">{{ deleteSuccess }}</p>
            </div>
          </div>

          <div v-else-if="userProfileError" class="text-red-500 text-center">{{ userProfileError.message }}</div>
          <div v-else class="text-zinc-500 text-center">No profile data available.</div>
        </div>

        <!-- Quick Links -->
        <div class="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-700 shadow-lg">
          <h2 class="text-3xl font-bold text-white mb-6 text-center">Quick Links</h2>

          <div v-if="userProfile">
            <Button variant="secondary" class="w-full mt-4 bg-indigo-600 text-white hover:bg-indigo-500"
              @click="startStripeOnboarding">
              Connect with Stripe
            </Button>
          </div>
        </div>


      </div>
    </div>
  </NuxtLayout>
</template>
