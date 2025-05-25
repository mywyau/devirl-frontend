import { useFetch } from "nuxt/app";

/**
 * Logs out the current user by calling the backend logout endpoint.
 */
export async function sendLogoutRequest(logoutUrl: string) {
  return await useFetch(logoutUrl, {
    credentials: "include",
  });
}
