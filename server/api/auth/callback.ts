import { sessionOptions } from "@/server/utils/sessionOptions"; // update path as needed

import { defineEventHandler, getQuery, sendRedirect, setCookie } from "h3";
import { getIronSession } from "iron-session";
import { exchangeCodeForToken, getUserInfo } from "~/server/utils/auth0";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";
import { createUserNuxtServerToScalaServer } from "@/controllers/RegistrationController";
import { UserDataSchema } from "@/types/schema/UserDataSchema";
import type { UserData } from "@/types/schema/UserDataSchema";
import { loadConfig } from "@/configuration/ConfigLoader";

// Determine if running in production (for secure cookies)
const isProd = process.env.NODE_ENV === "production";

export default defineEventHandler(async (event) => {
  // 1. Get Auth0 code from query string (Auth0 sends this after login redirect)
  const { code } = getQuery(event);

  // 2. Use the code to exchange for access_token (Auth0 flow)
  const redirectUri = `${process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL}`;
  const { access_token } = await exchangeCodeForToken(
    code as string,
    redirectUri
  );

  // 3. Use the access_token to get user info from Auth0
  const user = await getUserInfo(access_token);
  const userId = user?.sub;

  // 4. Fail fast if Auth0 didn't return a valid user ID
  if (!userId) {
    throw createError({ statusCode: 400, message: "Missing user ID" });
  }

  // 5. Create a secure session and store the user object (without userType for now)
  const session = await getIronSession(
    event.node.req,
    event.node.res,
    sessionOptions
  );
  session.user = user;
  await session.save();

  // 6. Extract the session cookie header to forward it to your Scala backend (for Redis sync)
  const cookieHeaderRaw = event.node.res.getHeader("Set-Cookie");
  const cookieHeader = Array.isArray(cookieHeaderRaw)
    ? cookieHeaderRaw.map((h) => h.split(";")[0]).join("; ")
    : String(cookieHeaderRaw).split(";")[0];

  console.log(cookieHeader); // Debug: see what's being sent as cookie header

  // 7. Prepare user payload to create/register user in Scala backend
  const payload = {
    email: user?.email,
    firstName: user?.given_name,
    lastName: user?.family_name,
    // userType: role.value (optional at this point)
  };

  // 8. Validate user data against your Zod schema
  const parsed: UserData = UserDataSchema.parse(payload);

  // 9. Instantiate your backend controller
  const devQuestBackendAuthController = new DevQuestBackendAuthController();

  // 10. Store the session cookie in Redis (via Scala backend)
  await devQuestBackendAuthController.storeCookieSessionInRedisServerToServer(
    userId,
    cookieHeader
  );

  // 11. Register the user (if they don’t already exist) using your backend
  await createUserNuxtServerToScalaServer(userId, cookieHeader, parsed);

  // 12. Now try to fetch user data from backend to get their userType (if set)
  const config = loadConfig();
  let userType: string | null = null;

  try {
    const userData = await $fetch(
      `${config.devQuestBackend.baseUrl}/registration/user/data/${encodeURIComponent(
        userId
      )}`,
      {
        method: "GET",
        headers: {
          cookie: cookieHeader, // Send session cookie for auth
        },
      }
    );
    userType = userData?.userType ?? null;
  } catch (err) {
    console.warn(`[callback.ts] User not found in backend: ${err}`);
  }

  if (userType) {
    try {
      const response = await $fetch(
        `${config.devQuestBackend.baseUrl}/auth/session/sync/${encodeURIComponent(userId)}`,
        {
          method: "POST",
          headers: {
            cookie: cookieHeader, // Send session cookie for auth
          },
        }
      );
    } catch (err) {
      console.warn(`[callback.ts] Auth session not synced in backend cache from db: ${err}`);
    }
  }

  // 13. Store userType in a non-httpOnly cookie for frontend UI use
  if (userType) {
    setCookie(event, "user_type", userType, {
      httpOnly: false, // frontend-accessible
      secure: process.env.NODE_ENV === "production",
      ttl: 60 * 60 * 8,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      ...(isProd && { domain: ".devirl.com" }),
    });
  }

  // 14. Redirect user based on whether they've selected a role yet
  return sendRedirect(event, userType ? "/" : "/choose-user-type");
});
