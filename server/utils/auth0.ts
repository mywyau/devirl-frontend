// server/utils/auth0.ts

import { useRuntimeConfig } from "#imports"; // ✅ allowed in server routes

const runtimeConf = useRuntimeConfig();

const auth0ClientSecret = runtimeConf.auth0ClientSecret;
const auth0Domain = runtimeConf.public.auth0Domain;
const auth0ClientId = runtimeConf.public.auth0ClientId;

console.log("auth0ClientSecret ", auth0ClientSecret)
console.log("auth0Domain", auth0Domain)
console.log("auth0ClientId", auth0ClientId)

export async function exchangeCodeForToken(code: string, redirectUri: string) {
  const res = await fetch(`https://${auth0Domain}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: auth0ClientId!,
      client_secret: auth0ClientSecret!,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) throw new Error("Failed to exchange code for token");
  return await res.json();
}

export async function getUserInfo(accessToken: string) {
  const res = await fetch(`https://${auth0Domain}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error("Failed to fetch user info");
  return await res.json();
}
