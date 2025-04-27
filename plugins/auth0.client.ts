import { defineNuxtPlugin } from "#app";
import { useRuntimeConfig, useRouter } from "#imports";
import { createAuth0Client } from "@auth0/auth0-spa-js";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const router = useRouter();

  const auth0 = await createAuth0Client({
    domain: config.public.auth0Domain,
    clientId: config.public.auth0ClientId,
    authorizationParams: {
      redirect_uri: window.location.origin,
      scope: "openid profile email",
    },
  });

  // Handle redirect from Auth0 login
  const isRedirect = window.location.search.includes("code=") &&
                     window.location.search.includes("state=");

  if (isRedirect) {
    try {
      const result = await auth0.handleRedirectCallback();
      const redirectTo = result.appState?.target || "/";

      // ONLY navigate if current path is not already the target
      if (window.location.pathname !== redirectTo) {
        router.replace(redirectTo);
      } else {
        // Clean up the URL (remove code= and state=)
        window.history.replaceState({}, document.title, redirectTo);
      }
    } catch (err) {
      console.error("Error during Auth0 redirect handling:", err);
      router.replace("/500");
    }
  }

  nuxtApp.provide("auth0", auth0);
});
