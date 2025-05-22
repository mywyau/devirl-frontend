<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProfileItem from "@/components/ui/profile/ProfileItem";

// User Profile code

const user = ref<null | {
  name: string;
  email: string;
  user_type: string;
}>(null);

const userProfileError = ref("");

onMounted(async () => {
  try {
    user.value = await $fetch("/api/me");
  } catch (e: any) {
    userProfileError.value = e.data?.message || "Unable to load profile";
  }
});
</script>

<template>
  <NuxtLayout>
    <div class="max-w-5xl mx-auto mt-16 p-6">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- User Profile -->
        <div class="flex-1 p-6 shadow-md rounded-2xl border">
          <h1 class="text-2xl font-bold mb-6 text-center">Client Profile</h1>

          <div class="space-y-4">
            <ProfileItem label="Name" :value="user?.name" />
            <ProfileItem label="Email" :value="user?.email" />
            <ProfileItem label="Role" :value="user?.user_type" />
          </div>

          <div
            v-if="userProfileError"
            class="text-red-500 mt-4 text-center text-sm"
          >
            {{ userProfileError }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
