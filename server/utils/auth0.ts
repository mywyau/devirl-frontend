import { useRuntimeConfig } from "#imports"; // ✅ allowed in server routes

const runtimeConf = useRuntimeConfig();

const auth0ClientSecret = runtimeConf.auth0ClientSecret;
const auth0Domain = runtimeConf.public.auth0Domain;
const auth0ClientId = runtimeConf.public.auth0ClientId;

console.log("[auth0.ts] Loaded Auth0 config:", {
  auth0Domain,
  auth0ClientId,
  hasClientSecret: !!auth0ClientSecret,
});

export async function exchangeCodeForToken(code: string, redirectUri: string) {
  console.log("[exchangeCodeForToken] Requesting token with:", {
    auth0Domain,
    auth0ClientId,
    redirectUri,
    code,
  });

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

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("[exchangeCodeForToken] Token request failed", {
      status: res.status,
      statusText: res.statusText,
      body: errorBody,
    });
    throw new Error("Failed to exchange code for token");
  }

  const tokenResponse = await res.json();
  console.log("[exchangeCodeForToken] Token response:", tokenResponse);

  return tokenResponse;
}

export async function getUserInfo(accessToken: string) {
  console.log("[getUserInfo] Fetching user info with access token");

  const res = await fetch(`https://${auth0Domain}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("[getUserInfo] Failed to fetch user info", {
      status: res.status,
      statusText: res.statusText,
      body: errorBody,
    });
    throw new Error("Failed to fetch user info");
  }

  const userInfo = await res.json();
  console.log("[getUserInfo] Retrieved user info:", userInfo);

  return userInfo;
}
