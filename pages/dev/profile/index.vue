<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProfileItem from "@/components/ui/profile/ProfileItem";
import { getUser, deleteUserData } from "@/controllers/UserDataController";
import { useAuthUser } from "~/composables/useAuthUser";
import {
  GetUserDataSchema,
  type GetUserData,
} from "@/types/schema/UserDataSchema";

const userProfile = ref<GetUserData | null>(null);
const userProfileError = ref("");

// Load current authenticated user
const { data: user, userError, refresh } = await useAuthUser();


const userId = user.value?.sub;

if (!userId) {
  console.warn("[DevUserProfile] No user ID found in session.");
  userProfileError.value = "User not authenticated.";
}

const loadUserProfile = async (userId: string) => {
  try {
    const rawData = await deleteUserData(userId);

    if (!parsed.success) {
      console.error("[DevUserProfile] Validation error:", parsed.error);
      userProfileError.value = "Invalid user data from server.";
      return;
    }

    userProfile.value = parsed.data;
  } catch (err: any) {
    console.error("[DevUserProfile] Failed to load profile:", err);
    userProfileError.value = err?.data?.message || "Unable to load profile";
  }
};


const deleteUserProfile = async (userId: string) => {
  try {
    const rawData = await getUser(userId);
    
    if (!parsed.success) {
      console.error("[DevUserProfile] Validation error:", parsed.error);
      userProfileError.value = "Invalid user data from server.";
      return;
    }

    userProfile.value = parsed.data;
  } catch (err: any) {
    console.error("[DevUserProfile] Failed to load profile:", err);
    userProfileError.value = err?.data?.message || "Unable to load profile";
  }
};

onMounted(() => {
  if (userId) {
    loadUserProfile(userId);
  }
});


</script>


<template>
  <NuxtLayout>
    <div class="max-w-5xl mx-auto mt-16 p-6">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- User Profile -->
        <div class="flex-1 p-6 shadow-md rounded-2xl border">
          <h1 class="text-2xl font-bold mb-6 text-center">User Profile</h1>

          <div class="space-y-4">
            <ProfileItem
              label="Name"
              :value="`${userProfile?.firstName ?? ''} ${
                userProfile?.lastName ?? ''
              }`"
              textColor="text-white"
            />
            <ProfileItem
              label="Email"
              :value="userProfile?.email"
              textColor="text-white"
            />
            <ProfileItem
              label="Role"
              :value="userProfile?.userType || '—'"
              textColor="text-white"
            />
          </div>

          <p
            v-if="userProfileError"
            class="text-red-500 mt-4 text-center text-sm"
          >
            {{ userProfileError }}
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
