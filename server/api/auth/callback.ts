//  server/api/auth/callback.ts

import { loadConfig } from "@/configuration/ConfigLoader";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";
import { createUserNuxtServerToScalaServer } from "@/controllers/RegistrationController";
import { sessionOptions } from "@/server/utils/sessionOptions";
import type { UserData } from "@/types/schema/UserDataSchema";
import { UserDataSchema } from "@/types/schema/UserDataSchema";
import {
  createError,
  defineEventHandler,
  getQuery,
  sendRedirect,
  setCookie,
} from "h3";
import { getIronSession } from "iron-session";
import { exchangeCodeForToken, getUserInfo } from "@/server/utils/auth0";
import { getSessionCookieHeader } from "@/utils/CallbackHelpers";

interface SessionData {
  user?: {
    email: string;
    given_name: string;
    family_name: string;
    sub: string;
    [key: string]: any;
  };
}

const isProd = process.env.NODE_ENV === "production";

export async function getAccessToken(event: any): Promise<string> {
  const { code } = getQuery(event);
  if (!code) throw createError({ statusCode: 400, message: "Missing code" });

  const redirectUri = process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL!;
  const { access_token } = await exchangeCodeForToken(
    code as string,
    redirectUri
  );
  return access_token;
}

export async function authenticateUser(
  access_token: string
): Promise<{ user: any; userId: string }> {
  const user = await getUserInfo(access_token);
  const userId = user?.sub;
  if (!userId)
    throw createError({ statusCode: 400, message: "Missing user ID" });
  return { user, userId };
}

export async function storeSession(event: any, user: any): Promise<string> {
  const session = await getIronSession<SessionData>(
    event.node.req,
    event.node.res,
    sessionOptions
  );
  session.user = user;
  await session.save();
  return getSessionCookieHeader(event.node.res.getHeader("Set-Cookie"));
}

async function syncUserToBackend(
  user: any,
  userId: string,
  cookieHeader: string
) {
  const parsed: UserData = UserDataSchema.parse({
    email: user.email,
    firstName: user.given_name,
    lastName: user.family_name,
  });

  const backendController = new DevQuestBackendAuthController();
  await backendController.storeCookieSessionInRedisServerToServer(
    userId,
    cookieHeader
  );
  await createUserNuxtServerToScalaServer(userId, cookieHeader, parsed);
}

async function fetchUserType(
  userId: string,
  cookieHeader: string
): Promise<string | null> {
  const config = loadConfig();
  try {
    const userData = await $fetch<UserData>(
      `${
        config.devQuestBackend.baseUrl
      }/registration/user/data/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: { cookie: cookieHeader },
      }
    );
    return userData?.userType ?? null;
  } catch (err) {
    console.warn(`[callback.ts] User not found in backend: ${err}`);
    return null;
  }
}

async function syncSessionToBackend(userId: string, cookieHeader: string) {
  const config = loadConfig();
  try {
    await $fetch(
      `${config.devQuestBackend.baseUrl}/auth/session/sync/${encodeURIComponent(
        userId
      )}`,
      {
        method: "POST",
        headers: { cookie: cookieHeader },
      }
    );
  } catch (err) {
    console.warn(
      `[callback.ts] Auth session not synced in backend cache from db: ${err}`
    );
  }
}

function setUserTypeCookie(event: any, userType: string) {
  setCookie(event, "user_type", userType, {
    httpOnly: false,
    secure: isProd,
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: "lax",
    path: "/",
    ...(isProd && { domain: ".devirl.com" }),
  });
}

export default defineEventHandler(async (event) => {
  const accessToken = await getAccessToken(event);
  const { user, userId } = await authenticateUser(accessToken);
  const cookieHeader = await storeSession(event, user);
  await syncUserToBackend(user, userId, cookieHeader);

  const userType = await fetchUserType(userId, cookieHeader);

  if (userType) {
    await syncSessionToBackend(userId, cookieHeader);
    setUserTypeCookie(event, userType);
  }

  return sendRedirect(event, userType ? "/" : "/choose-user-type");
});
