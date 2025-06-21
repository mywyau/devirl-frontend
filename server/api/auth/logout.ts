// ./server/api/auth/logout.ts

import { defineEventHandler, sendRedirect, setCookie } from "h3";
import { getIronSession } from "iron-session";
import { $fetch } from "ofetch";
import { loadConfig } from "~/configuration/ConfigLoader";
import { sessionOptions } from "~/server/utils/sessionOptions"; // ✅ import the shared options

import { useRuntimeConfig } from "#imports"; // ✅ allowed in server routes

const runtimeConf = useRuntimeConfig();

const auth0Domain = runtimeConf.public.auth0Domain;
const auth0ClientId = runtimeConf.public.auth0ClientId;
const auth0CallbackUrl = runtimeConf.public.auth0CallbackUrl;

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


  if (!auth0Domain || !auth0ClientId) {
    throw new Error("Missing Auth0 environment variables");
  }

  const returnTo = config.devIrlFrontend.baseUrl || "http://localhost:3000";

  const auth0LogoutUrl =
    `https://${auth0Domain}/v2/logout?` +
    new URLSearchParams({
      client_id: auth0ClientId,
      returnTo,
      // federated: "true", //this fully logs out of google, works but overkill, rely on prompt: "login" when user logs in.
    }).toString();

  return sendRedirect(event, auth0LogoutUrl);
});
