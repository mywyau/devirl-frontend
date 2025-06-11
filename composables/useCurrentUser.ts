// composables/useCurrentUser.ts
import { useAuthUser } from "@/composables/useAuthUser";

export function useCurrentUser() {
  const { data, error } = useAuthUser(); // ✅ Called only once
  return { user: data, error };
}
