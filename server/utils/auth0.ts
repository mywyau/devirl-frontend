// server/utils/auth0.ts


export async function exchangeCodeForToken(code: string, redirectUri: string) {
  
  // console.log(process.env.AUTH0_CLIENT_SECRET);

  const res = await fetch(
    `https://${process.env.NUXT_PUBLIC_AUTH0_DOMAIN}/oauth/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID!,
        client_secret: process.env.AUTH0_CLIENT_SECRET!,
        code,
        redirect_uri: redirectUri,
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to exchange code for token");
  return await res.json();
}

export async function getUserInfo(accessToken: string) {
  const res = await fetch(
    `https://${process.env.NUXT_PUBLIC_AUTH0_DOMAIN}/userinfo`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch user info");
  return await res.json();
}
