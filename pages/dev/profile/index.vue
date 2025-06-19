<script setup lang="ts">
import { Button } from "@/components/ui/button/variants";
import ProfileItem from "@/components/ui/profile/ProfileItem";
// import { useAuthUser } from "@/composables/useAuthUser";
import { deleteUser, getUser } from "@/controllers/UserDataController";
import type { AuthUser } from "@/types/AuthUser";
import { DeleteResponseSchema, type DeleteResponse } from "@/types/schema/ApiResponses";
import { GetUserDataSchema, type GetUserData } from "@/types/schema/UserDataSchema";
import { useAsyncData, useFetch, useRequestHeaders } from "nuxt/app";
import { computed, ref } from "vue";

// Get authenticated user (must work in SSR)
// const { data: authUser, error: authError } = await useAuthUser();

const headers: Record<string, string> | undefined = useRequestHeaders(["cookie"]);


const { data: authUser, error } = await useFetch<AuthUser | null>('/api/auth/session', {
  headers: headers,
  credentials: 'include',
  transform: (res: any) => res.user ?? null,
  default: () => null,
});

const userId = computed(() => authUser.value?.sub);

console.log('userId on server:', userId.value);


// Fetch profile using SSR-friendly asyncData
const { data: userProfile, error: userProfileError, pending: isLoading } = await useAsyncData<GetUserData | null>(
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
</script>

<template>
  <NuxtLayout>
    <div class="max-w-6xl mx-auto mt-16 px-4 md:px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

        <!-- Profile Info Card -->
        <div class="p-6 rounded-2xl border border-zinc-700 shadow-lg">
          <h2 class="text-3xl font-bold text-white mb-6 text-center">Your Profile</h2>

          <div v-if="isLoading" class="text-zinc-400 text-center">Loading...</div>

          <div v-else-if="userProfile">
            <div class="space-y-4">
              <ProfileItem label="First Name" labelColor="text-white" textColor="text-blue-400"
                :value="userProfile.firstName" />
              <ProfileItem label="Last Name" labelColor="text-white" textColor="text-blue-400"
                :value="userProfile.lastName" />
              <ProfileItem label="Email" :value="userProfile.email" labelColor="text-white" textColor="text-blue-400" />
              <ProfileItem label="Username" :value="userProfile.username" labelColor="text-white"
                textColor="text-blue-400" />
              <ProfileItem label="Role" :value="userProfile.userType ?? '—'" labelColor="text-white"
                textColor="text-blue-400" />

              <Button variant="secondary" class="w-full mt-6 bg-red-600 text-white hover:bg-red-500"
                :disabled="isDeleting" @click="handleDeleteUser">
                {{ isDeleting ? "Deleting..." : "Delete user profile" }}
              </Button>

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
            <!-- <nav class="space-y-4">
              <NuxtLink to="/profile/equipment"
                class="block text-lg text-zinc-300 hover:text-white hover:underline transition">Equipment</NuxtLink>
              <NuxtLink to="/dev/skills"
                class="block text-lg text-zinc-300 hover:text-white hover:underline transition">Skills</NuxtLink>
              <NuxtLink to="/dev/inventory"
                class="block text-lg text-zinc-300 hover:text-white hover:underline transition">Inventory</NuxtLink>
            </nav> -->
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
