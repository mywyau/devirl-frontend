// ./server/api/auth/logout.ts

import { loadConfig } from "@/configuration/ConfigLoader";
import { sessionOptions } from "@/server/utils/sessionOptions"; // ✅ import the shared options
import { defineEventHandler, sendRedirect, setCookie } from "h3";
import { getIronSession } from "iron-session";
import { $fetch } from "ofetch";

export default defineEventHandler(async (event) => {
  const config = loadConfig();

  const session = await getIronSession(event.node.req, event.node.res, {
    password: process.env.SESSION_SECRET!,
    cookieName: "auth_session",
  });

  const userId = session.user?.sub;

  // 🔁 Delete session from Redis if it exists
  if (userId) {
    try {
      const url = `${
        config.devQuestBackend.baseUrl
      }/auth/session/delete/${encodeURIComponent(userId)}`;
      console.info(`[Logout] Deleting Redis session for ${userId}`);
      await $fetch(url, { method: "DELETE" });
    } catch (err) {
      console.warn(
        `[Logout] Failed to delete Redis session for ${userId}`,
        err
      );
    }
  } else {
    console.warn(`[Logout] No user found in session; skipping Redis delete.`);
  }

  // ❌ Destroy the secure session
  await session.destroy();

  setCookie(event, "auth_session", "", {
    ...sessionOptions.cookieOptions,
    maxAge: 0,
  });

  // 🧹 Clear the user_type cookie (frontend-visible role cookie)
  setCookie(event, "user_type", "", {
    path: "/",
    httpOnly: false, // was set as non-HttpOnly, so this matches
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // ← removes the cookie
  });

  // ✅ Redirect to Auth0 logout endpoint
  const {
    NUXT_PUBLIC_AUTH0_DOMAIN,
    NUXT_PUBLIC_AUTH0_CLIENT_ID,
    NUXT_PUBLIC_DEVIRL_BASE_URL,
  } = process.env;

  if (!NUXT_PUBLIC_AUTH0_DOMAIN || !NUXT_PUBLIC_AUTH0_CLIENT_ID) {
    throw new Error("Missing Auth0 environment variables");
  }

  const returnTo = config.devIrlFrontend.baseUrl || "http://localhost:3000";

  const auth0LogoutUrl =
    `https://${NUXT_PUBLIC_AUTH0_DOMAIN}/v2/logout?` +
    new URLSearchParams({
      client_id: NUXT_PUBLIC_AUTH0_CLIENT_ID,
      returnTo,
    }).toString();

  return sendRedirect(event, auth0LogoutUrl);
});
