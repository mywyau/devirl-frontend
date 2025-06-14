import { useRuntimeConfig } from "#imports";
import { createError, defineEventHandler, sendRedirect } from "h3";

const runtimeConf = useRuntimeConfig();

const auth0Domain = runtimeConf.public.auth0Domain;
const auth0ClientId = runtimeConf.public.auth0ClientId;
const auth0CallbackUrl = runtimeConf.public.auth0CallbackUrl;

export default defineEventHandler(async (event) => {
  if (!auth0Domain || !auth0ClientId || !auth0CallbackUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing Auth0 env vars",
    });
  }

  const redirectTo =
    `https://${auth0Domain}/authorize?` +
    new URLSearchParams({
      response_type: "code",
      client_id: auth0ClientId,
      redirect_uri: auth0CallbackUrl,
      scope: "openid profile email",
      prompt: "login",                // redirects to google login and prompts user to re-log in every time they hit login. 
    });

  console.log("[auth0/login] Redirecting to:", redirectTo);

  return sendRedirect(event, redirectTo);
});
