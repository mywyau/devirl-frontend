<script setup lang="ts">
import { ref, onMounted } from "vue";
import { z } from "zod";
import ProfileItem from "@/components/ui/profile/ProfileItem";
import { getUser } from "@/controllers/UserDataController";
import { useAuthUser } from "~/composables/useAuthUser";
import {
  GetUserDataSchema,
  type GetUserData,
} from "@/types/schema/UserDataSchema";

const userProfile = ref<GetUserData | null>(null);
const userProfileError = ref("");

const { user, error } = await useAuthUser();
const safeUserId = user.value?.sub || "No user id";

console.log("[ClientUserProfile] Loaded user from session:", user.value);

onMounted(async () => {
  try {
    console.info("[ClientUserProfile] Fetching user profile for ID:", safeUserId);

    const rawData = await getUser(safeUserId);
    console.debug("[ClientUserProfile] Raw user data from API:", rawData);

    const result = GetUserDataSchema.safeParse(rawData);

    if (!result.success) {
      console.error("[ClientUserProfile] Validation failed", result.error);
      userProfileError.value = "Invalid user data from server.";
      return;
    }

    console.info(
      "[ClientUserProfile] Parsed and validated user data:",
      result.data
    );
    userProfile.value = result.data;
  } catch (e: any) {
    console.error("[ClientUserProfile] Failed to load profile", e);
    userProfileError.value = e?.data?.message || "Unable to load profile";
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
