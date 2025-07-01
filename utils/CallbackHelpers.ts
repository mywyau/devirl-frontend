import { loadConfig } from "@/configuration/ConfigLoader";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";
import { createUserNuxtServerToScalaServer } from "@/connectors/RegistrationConnector";
import { exchangeCodeForToken, getUserInfo } from "@/server/utils/auth0";
import { sessionOptions } from "@/server/utils/sessionOptions";
import type { UserData } from "@/types/schema/UserDataSchema";
import { UserDataSchema } from "@/types/schema/UserDataSchema";
import type { SessionData } from "@/types/SessionData";
import { createError, setCookie } from "h3";
import { getIronSession } from "iron-session";

// import { useRuntimeConfig } from "#imports"; // ✅ allowed in server routes

// const runtimeConf = useRuntimeConfig();

// const isProd = runtimeConf.public.auth0Domain;
// const auth0Domain = runtimeConf.public.auth0Domain;
// const auth0ClientId = runtimeConf.public.auth0ClientId;
// const auth0CallbackUrl = runtimeConf.public.auth0CallbackUrl;

const auth0CallbackUrl = process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL;

export function getSessionCookieHeader(
  raw: string | string[] | number | undefined
): string {
  if (!raw) return "";
  return Array.isArray(raw)
    ? raw.map((h) => h.split(";")[0]).join("; ")
    : String(raw).split(";")[0];
}

const isProd = process.env.NODE_ENV === "production";
console.log("[isProd] CallbackHelpers ", isProd);

export async function getAccessToken(code: string): Promise<string> {
  if (!code) throw createError({ statusCode: 400, message: "Missing code" });

  const redirectUri = auth0CallbackUrl!;
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
  // const session = await getIronSession(
  const session = await getIronSession<SessionData>(
    event.node.req,
    event.node.res,
    sessionOptions
  );
  session.user = user;
  await session.save();
  return getSessionCookieHeader(event.node.res.getHeader("Set-Cookie"));
}

export async function syncUserToBackend(
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

export async function fetchUserType(
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
    // console.log(`[callback.ts] User not found in backend: ${err}`);
    return null;
  }
}

export async function syncSessionToBackend(
  userId: string,
  cookieHeader: string
) {
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
    // console.log(
    //   `[callback.ts] Auth session not synced in backend cache from db: ${err}`
    // );
  }
}

export function setUserTypeCookie(event: any, userType: string) {
  setCookie(event, "user_type", userType, {
    httpOnly: false,
    secure: isProd,
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: "lax",
    path: "/",
    ...(isProd && { domain: ".devirl.com" }),
  });
}
