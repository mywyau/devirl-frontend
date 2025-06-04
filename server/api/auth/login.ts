//  ./server/api/auth/login.ts

import { defineEventHandler, sendRedirect, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const { NUXT_PUBLIC_AUTH0_DOMAIN, NUXT_PUBLIC_AUTH0_CLIENT_ID, NUXT_PUBLIC_AUTH0_CALLBACK_URL } = process.env;

  if (!NUXT_PUBLIC_AUTH0_DOMAIN || !NUXT_PUBLIC_AUTH0_CLIENT_ID || !NUXT_PUBLIC_AUTH0_CALLBACK_URL) {
    throw createError({ statusCode: 500, statusMessage: 'Missing Auth0 env vars' });
  }

  const redirectTo = `https://${NUXT_PUBLIC_AUTH0_DOMAIN}/authorize?` + new URLSearchParams({
    response_type: 'code',
    client_id: NUXT_PUBLIC_AUTH0_CLIENT_ID,
    redirect_uri: NUXT_PUBLIC_AUTH0_CALLBACK_URL,
    scope: 'openid profile email',
  });

  return sendRedirect(event, redirectTo);
});
