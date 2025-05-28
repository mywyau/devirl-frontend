// ~/composables/useAuthUser.ts
import { useAsyncData } from "nuxt/app";
import type { AuthUser } from "@/types/auth";

export const useAuthUser = () =>
  useAsyncData<AuthUser | null>(
    "authUser",
    async () => {
      try {
        const { user } = await $fetch<{ user: AuthUser }>("/api/auth/session", {
          credentials: "include",
        });
        return user ?? null;
      } catch (err: any) {
        if (err?.response?.status === 401) return null;
        throw err;
      }
    },
    {
      default: () => null,
      lazy: false,
      server: true,
    }
  );
