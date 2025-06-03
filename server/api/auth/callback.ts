import { defineEventHandler, getQuery, sendRedirect, setCookie, createError } from "h3";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/server/utils/sessionOptions";
import { exchangeCodeForToken, getUserInfo } from "~/server/utils/auth0";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";
import { createUserNuxtServerToScalaServer } from "@/controllers/RegistrationController";
import { UserDataSchema } from "@/types/schema/UserDataSchema";
import type { UserData } from "@/types/schema/UserDataSchema";
import { loadConfig } from "@/configuration/ConfigLoader";

const isProd = process.env.NODE_ENV === "production";

// 🔧 Helper to extract clean cookie header from iron-session
function getSessionCookieHeader(raw: string | string[] | number | undefined): string {
  if (!raw) return "";
  return Array.isArray(raw)
    ? raw.map((h) => h.split(";")[0]).join("; ")
    : String(raw).split(";")[0];
}

export default defineEventHandler(async (event) => {
  // 1. Get Auth0 code from query string (Auth0 sends this after login redirect)
  const { code } = getQuery(event);

  // 2. Exchange the code for an access_token (Auth0 flow)
  const redirectUri = process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL!;
  const { access_token } = await exchangeCodeForToken(code as string, redirectUri);

  // 3. Get Auth0 user info from access_token
  const user = await getUserInfo(access_token);
  const userId = user?.sub;
  if (!userId) throw createError({ statusCode: 400, message: "Missing user ID" });

  // 4. Store user in iron-session
  const session = await getIronSession(event.node.req, event.node.res, sessionOptions);
  session.user = user;
  await session.save();

  // 5. Prepare session cookie for Scala backend
  const cookieHeader = getSessionCookieHeader(event.node.res.getHeader("Set-Cookie"));
  console.log(cookieHeader); // Debug cookie output

  // 6. Create or update user in Scala backend
  const parsed: UserData = UserDataSchema.parse({
    email: user.email,
    firstName: user.given_name,
    lastName: user.family_name,
  });

  const backendController = new DevQuestBackendAuthController();
  await backendController.storeCookieSessionInRedisServerToServer(userId, cookieHeader);
  await createUserNuxtServerToScalaServer(userId, cookieHeader, parsed);

  // 7. Attempt to load userType from backend
  const config = loadConfig();
  let userType: string | null = null;

  try {
    const userData = await $fetch(`${config.devQuestBackend.baseUrl}/registration/user/data/${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: { cookie: cookieHeader },
    });
    userType = userData?.userType ?? null;
  } catch (err) {
    console.warn(`[callback.ts] User not found in backend: ${err}`);
  }

  // 8. If userType found, sync session cache with Scala backend
  if (userType) {
    try {
      await $fetch(`${config.devQuestBackend.baseUrl}/auth/session/sync/${encodeURIComponent(userId)}`, {
        method: "POST",
        headers: { cookie: cookieHeader },
      });
    } catch (err) {
      console.warn(`[callback.ts] Auth session not synced in backend cache from db: ${err}`);
    }
  }

  // 9. Set a frontend-accessible cookie for userType
  if (userType) {
    setCookie(event, "user_type", userType, {
      httpOnly: false,
      secure: isProd,
      ttl: 60 * 60 * 8,
      sameSite: "lax",
      path: "/",
      ...(isProd && { domain: ".devirl.com" }),
    });
  }

  // 10. Redirect based on whether userType is set
  return sendRedirect(event, userType ? "/" : "/choose-user-type");
});
