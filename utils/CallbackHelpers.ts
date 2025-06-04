import { loadConfig } from "@/configuration/ConfigLoader";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";
import { createUserNuxtServerToScalaServer } from "@/controllers/RegistrationController";
import { exchangeCodeForToken, getUserInfo } from "@/server/utils/auth0";
import { sessionOptions } from "@/server/utils/sessionOptions";
import type { UserData } from "@/types/schema/UserDataSchema";
import { UserDataSchema } from "@/types/schema/UserDataSchema";
import type { SessionData } from "@/types/SessionData";
import { createError, getQuery, setCookie } from "h3";
import { getIronSession } from "iron-session";

import { useRuntimeConfig } from "#imports";

const runtimeConf = useRuntimeConfig();

const auth0Domain = runtimeConf.public.auth0Domain;
const auth0ClientId = runtimeConf.public.auth0ClientId;
const auth0CallbackUrl = runtimeConf.public.auth0CallbackUrl;

export function getSessionCookieHeader(
  raw: string | string[] | number | undefined
): string {
  if (!raw) return "";
  return Array.isArray(raw)
    ? raw.map((h) => h.split(";")[0]).join("; ")
    : String(raw).split(";")[0];
}

const isProd = process.env.NODE_ENV === "production";
console.log("[CallbackHelpers] isProd =", isProd);
console.log("[CallbackHelpers] Runtime config loaded:", {
  auth0Domain,
  auth0ClientId,
  auth0CallbackUrl,
  hasSecret: Boolean(process.env.AUTH0_CLIENT_SECRET),
});

export async function getAccessToken(code: string): Promise<string> {
  if (!code) throw createError({ statusCode: 400, message: "Missing code" });

  console.log("[getAccessToken] Received code:", code);

  const redirectUri = auth0CallbackUrl!;
  const { access_token } = await exchangeCodeForToken(code, redirectUri);

  console.log("[getAccessToken] Received access token:", !!access_token);
  return access_token;
}

export async function authenticateUser(
  access_token: string
): Promise<{ user: any; userId: string }> {
  console.log("[authenticateUser] Using token:", access_token.slice(0, 8), "...");

  const user = await getUserInfo(access_token);
  console.log("[authenticateUser] Received user info:", user);

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

  const setCookieHeader = event.node.res.getHeader("Set-Cookie");
  console.log("[storeSession] Set-Cookie header:", setCookieHeader);

  return getSessionCookieHeader(setCookieHeader);
}

export async function syncUserToBackend(
  user: any,
  userId: string,
  cookieHeader: string
) {
  console.log("[syncUserToBackend] Syncing user to backend:", { userId, email: user.email });

  const parsed: UserData = UserDataSchema.parse({
    email: user.email,
    firstName: user.given_name,
    lastName: user.family_name,
  });

  const backendController = new DevQuestBackendAuthController();

  await backendController.storeCookieSessionInRedisServerToServer(userId, cookieHeader);
  await createUserNuxtServerToScalaServer(userId, cookieHeader, parsed);
}

export async function fetchUserType(
  userId: string,
  cookieHeader: string
): Promise<string | null> {
  const config = loadConfig();

  try {
    console.log("[fetchUserType] Fetching user type for:", userId);

    const userData = await $fetch<UserData>(
      `${config.devQuestBackend.baseUrl}/registration/user/data/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: { cookie: cookieHeader },
      }
    );

    console.log("[fetchUserType] Received userData:", userData);

    return userData?.userType ?? null;
  } catch (err) {
    console.warn(`[fetchUserType] User not found or fetch failed:`, err);
    return null;
  }
}

export async function syncSessionToBackend(
  userId: string,
  cookieHeader: string
) {
  const config = loadConfig();

  try {
    console.log("[syncSessionToBackend] Syncing session for:", userId);

    await $fetch(
      `${config.devQuestBackend.baseUrl}/auth/session/sync/${encodeURIComponent(userId)}`,
      {
        method: "POST",
        headers: { cookie: cookieHeader },
      }
    );
  } catch (err) {
    console.warn(
      `[syncSessionToBackend] Sync failed for user ${userId}:`,
      err
    );
  }
}

export function setUserTypeCookie(event: any, userType: string) {
  console.log("[setUserTypeCookie] Setting user_type cookie:", userType);

  setCookie(event, "user_type", userType, {
    httpOnly: false,
    secure: isProd,
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: "lax",
    path: "/",
    ...(isProd && { domain: ".devirl.com" }),
  });
}
