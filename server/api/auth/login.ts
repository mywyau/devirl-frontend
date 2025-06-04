import { createError, defineEventHandler, sendRedirect } from "h3";

import { useRuntimeConfig } from "#imports"; // ✅ allowed in server routes

const runtimeConf = useRuntimeConfig();

const auth0Domain = runtimeConf.public.auth0Domain;
const auth0ClientId = runtimeConf.public.auth0ClientId;
const auth0CallbackUrl = runtimeConf.public.auth0CallbackUrl;

export default defineEventHandler(async (event) => {
  // const { NUXT_PUBLIC_AUTH0_DOMAIN, NUXT_PUBLIC_AUTH0_CLIENT_ID, NUXT_PUBLIC_AUTH0_CALLBACK_URL } = process.env;

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
    });

  return sendRedirect(event, redirectTo);
});
