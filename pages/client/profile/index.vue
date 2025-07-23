<!-- src/pages/ClientUserProfile.vue -->
<script setup lang="ts">
import ConfirmDialog from '@/components/reka/ConfirmDialog.vue';

import ProfileItem from "@/components/old/profile/ProfileItem";
import { useAuthUser } from "@/composables/useAuthUser";
import { deleteUser, getUser } from "@/controllers/UserDataController";
import {
  DeleteResponseSchema,
  type DeleteResponse,
} from "@/types/schema/ApiResponses";
import {
  GetUserDataSchema,
  type GetUserData,
} from "@/types/schema/UserDataSchema";
import { onMounted, ref } from "vue";

// Helper for percentages
function percent(part: number, total: number): string {
  return total === 0 ? '0%' : `${Math.round((part / total) * 100)}%`
}

// Reactive state
const userProfile = ref<GetUserData | null>(null);
const userProfileError = ref<string>("");
const isLoading = ref<boolean>(false);

const deleteResponse = ref<DeleteResponse | null>(null);
const deleteError = ref<string>("");
const isDeleting = ref<boolean>(false);
const deleteSuccess = ref<string>("");

// Authenticated user
const { data: authUser, error: authError } = await useAuthUser();
const userId = authUser.value?.sub;

// Fetch user profile
async function fetchUserProfile(id: string) {
  userProfileError.value = "";
  isLoading.value = true;
  try {
    const raw = await getUser(id);
    const result = GetUserDataSchema.safeParse(raw);
    if (!result.success) {
      console.error(
        "[ClientUserProfile] Profile validation error:",
        result.error
      );
      userProfileError.value = "Invalid user data from server.";
      return;
    }
    userProfile.value = result.data;
  } catch (e: any) {
    console.error("[ClientUserProfile] Fetch error:", e);
    userProfileError.value = e?.data?.message || "Unable to load profile.";
  } finally {
    isLoading.value = false;
  }
}

// Delete user profile
async function handleDeleteUser() {
  deleteError.value = deleteSuccess.value = "";
  isDeleting.value = true;
  if (!userId) {
    deleteError.value = "User ID not found.";
    isDeleting.value = false;
    return;
  }

  try {
    const raw = await deleteUser(userId);
    const parsed = DeleteResponseSchema.safeParse(raw);
    if (!parsed.success) {
      console.error(
        "[ClientUserProfile] Delete validation error:",
        parsed.error
      );
      deleteError.value = "Invalid response from server.";
    } else {
      deleteResponse.value = parsed.data;
      deleteSuccess.value = parsed.data.message || "User deleted successfully.";
      userProfile.value = null;
    }
  } catch (e: any) {
    console.error("[ClientUserProfile] Delete error:", e);
    deleteError.value = e?.data?.message || "Unable to delete user.";
  } finally {
    isDeleting.value = false;
  }
}

// Initialize
onMounted(() => {
  if (!userId) {
    userProfileError.value = "User not authenticated.";
    console.warn("[ClientUserProfile] No user ID in session.");
    return;
  }
  fetchUserProfile(userId);
});
</script>

<template>
  <NuxtLayout>
    <div class="max-w-5xl mx-auto mt-16 mb-16 p-6">
      <div class="flex flex-col md:flex-row gap-8">
        <div class="bg-zinc-800 flex-1 rounded-3xl p-10">
          <h1 class="text-2xl text-white font-bold mb-6 text-center">
            Your Profile
          </h1>

          <div class="text-white" v-if="isLoading">Loading...</div>
          <div v-else>
            <div v-if="userProfile">

              <div class="space-y-4 mb-6">
                <ProfileItem label="Username" :value="userProfile.username" labelColor="text-white" textColor="text-teal-300" />
                <ProfileItem label="Email" :value="userProfile.email" labelColor="text-white" textColor="text-teal-300" />
                <ProfileItem label="Role" :value="userProfile.userType ?? '—'" labelColor="text-white" textColor="text-teal-300" />
                <ProfileItem label="First Name" labelColor="text-white" textColor="text-teal-300" :value="userProfile.firstName" />
                <ProfileItem label="Last Name" labelColor="text-white" textColor="text-teal-300" :value="userProfile.lastName" />
              </div>


              <ConfirmDialog :data-testid="`delete-user-profile`" title="Are you sure you want to delete your profile?"
                description="Please confirm if you wish to delete your profile. This action cannot be undone and all your data will be removed."
                triggerText="Delete profile" triggerClass="px-4 py-2 bg-red-500 hover:bg-red-400 rounded text-white"
                actionText="Yes, delete my profile"
                actionClass="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded text-sm font-sans"
                @confirm="handleDeleteUser" />


              <p v-if="deleteError" class="text-red-500 mt-4 text-center text-sm">
                {{ deleteError }}
              </p>
              <p v-if="deleteSuccess" class="text-green-600 mt-4 text-center text-sm">
                {{ deleteSuccess }}
              </p>
            </div>

            <p v-else-if="userProfileError" class="text-red-500 mt-4 text-center text-sm">
              {{ userProfileError }}
            </p>
            <p v-else class="text-blue-400 mt-4 text-center text-sm">
              No profile data available.
            </p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
