// ~/composables/useAuthUser.ts
import { useAsyncData, useRequestHeaders } from "nuxt/app";
import type { AuthUser } from "@/types/AuthUser";

export const useAuthUser = () =>
  useAsyncData<AuthUser | null>(
    "authUser",
    // NOTE: we grab the “cookie” header from the incoming request (if any),
    // and pass it to $fetch. That way SSR actually sees the same session cookie
    // the browser sent.
    () =>
      $fetch<{ user: AuthUser }>("/api/auth/session", {
        // On the client, `useRequestHeaders(["cookie"])` is just undefined,
        // but on the server it will contain the real “cookie” header string.
        headers: useRequestHeaders(["cookie"]),
        credentials: "include",
      })
        .then((res) => res.user ?? null)
        .catch((err: any) => {
          if (err?.response?.status === 401) return null;
          throw err;
        }),
    {
      default: () => null,
      lazy: false,    // fetch as soon as possible
      server: true,   // run on server
    }
  );
