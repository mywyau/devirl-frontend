<!-- src/pages/ClientUserProfile.vue -->
<script setup lang="ts">
import { Button } from "@/components/ui/button/variants";
import ProfileItem from "@/components/ui/profile/ProfileItem";
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


const clientStats = ref({
  totalQuests: 12,
  questsFailed: 3,
  questsSucceeded: 7,
  questsRewarded: 6,
  completionRewardPaid: 6,
})

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
              <div class="space-y-4">
                <ProfileItem textColor="text-white" labelColor="text-white" label="First Name"
                  :value="`${userProfile.firstName}`" />

                <ProfileItem textColor="text-white" labelColor="text-white" label="Last Name"
                  :value="`${userProfile.lastName}`" />

                <ProfileItem textColor="text-white" labelColor="text-white" label="Username"
                  :value="userProfile.username" />

                <ProfileItem textColor="text-white" labelColor="text-white" label="Email" :value="userProfile.email" />
                <ProfileItem textColor="text-white" labelColor="text-white" label="Role"
                  :value="userProfile.userType ?? '—'" />
              </div>

              <div class="mt-10 border-t border-zinc-700 pt-6">
                <h2 class="text-xl text-emerald-400 font-semibold mb-4 text-center">
                  Quest Stats
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 text-white text-center">
                  <div class="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                    <p class="text-sm text-white mb-2">Quests Failed</p>
                    <p class="text-xl font-bold text-red-400">
                      {{ percent(clientStats.questsFailed, clientStats.totalQuests) }}
                    </p>
                    <Separator class="bg-zinc-600 my-2 h-px w-full" />
                    <p class="text-sm text-white">
                      {{ clientStats.questsFailed }} / {{ clientStats.totalQuests }}
                    </p>
                  </div>

                  <div class="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                    <p class="text-sm text-white mb-2">Quests Succeeded</p>
                    <p class="text-xl font-bold text-green-400">
                      {{ percent(clientStats.questsSucceeded, clientStats.totalQuests) }}
                    </p>
                    <Separator class="bg-zinc-600 my-2 h-px w-full" />
                    <p class="text-sm text-white">
                      {{ clientStats.questsSucceeded }} / {{ clientStats.totalQuests }}
                    </p>
                  </div>

                  <div class="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                    <p class="text-sm text-white mb-2">Quests Paid Out</p>
                    <p class="text-xl font-bold text-blue-400">
                      {{ percent(clientStats.questsRewarded, clientStats.totalQuests) }}

                    </p>
                    <Separator class="bg-zinc-600 my-2 h-px w-full" />
                    <p class="text-sm text-white">
                      {{ clientStats.questsRewarded }} / {{ clientStats.totalQuests }}
                    </p>
                  </div>

                  <div class="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                    <p class="text-sm text-white mb-2">Completion Rewards paid</p>
                    <p class="text-xl font-bold text-indigo-400">
                      {{ percent(clientStats.completionRewardPaid, clientStats.totalQuests) }}

                    </p>
                    <Separator class="bg-zinc-600 my-2 h-px w-full" />
                    <p class="text-sm text-white">
                      {{ clientStats.completionRewardPaid }} / {{ clientStats.totalQuests }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- <Button variant="secondary" class="mt-6 bg-red-600 text-white rounded hover:bg-red-500"
                :disabled="isDeleting" @click="handleDeleteUser">
                {{ isDeleting ? "Deleting..." : "Delete user profile" }}
              </Button> -->

              <AlertDialogRoot>
                <AlertDialogTrigger as-child>
                  <Button variant="secondary" class="mt-6 bg-red-600 text-white rounded hover:bg-red-500"
                    :disabled="isDeleting">
                    {{ isDeleting ? "Deleting..." : "Delete user profile" }}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                  <AlertDialogOverlay class="bg-black/50 fixed inset-0 z-30" />
                  <AlertDialogContent
                    class="z-[100] fixed top-[50%] left-[50%] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg">
                    <AlertDialogTitle class="text-lg font-semibold text-black">
                      Confirm Account Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription class="mt-2 text-sm text-gray-700">
                      Are you absolutely sure you want to delete your user profile? This will remove all your data from
                      the platform and cannot be undone.
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
