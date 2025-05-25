import { defineEventHandler, getQuery, sendRedirect, setCookie } from "h3";
import { getIronSession } from "iron-session";
import { exchangeCodeForToken, getUserInfo } from "~/server/utils/auth0";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";
import { createUserServerToServer } from "@/controllers/RegistrationController";
import { UserDataSchema } from "@/types/schema/UserDataSchema";
import type { UserData } from "@/types/schema/UserDataSchema";
import { loadConfig } from "@/configuration/ConfigLoader";

const isProd = process.env.NODE_ENV === "production";

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "auth_session",
  ttl: 60 * 60 * 8,
  secure: isProd,
  sameSite: "none",
  path: "/",
  ...(isProd && { domain: ".devirl.com" }),
};

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event);
  const redirectUri = `${process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL}`;
  const { access_token } = await exchangeCodeForToken(
    code as string,
    redirectUri
  );
  const user = await getUserInfo(access_token);
  const userId = user?.sub;

  if (!userId) {
    throw createError({ statusCode: 400, message: "Missing user ID" });
  }

  const session = await getIronSession(
    event.node.req,
    event.node.res,
    sessionOptions
  );

  session.user = user; // ← set now, without userType yet

  await session.save();

  // Extract cookie to sync with Redis
  const cookieHeaderRaw = event.node.res.getHeader("Set-Cookie");

  const cookieHeader = Array.isArray(cookieHeaderRaw)
    ? cookieHeaderRaw.map((h) => h.split(";")[0]).join("; ")
    : String(cookieHeaderRaw).split(";")[0];

  console.log(cookieHeader);

  const payload = {
    email: user?.email,
    firstName: user?.given_name,
    lastName: user?.family_name,
    // userType: role.value,
  };

  const parsed: UserData = UserDataSchema.parse(payload);

  const safeUserId = user?.sub || "No user id";

  const devQuestBackendAuthController = new DevQuestBackendAuthController();

  await devQuestBackendAuthController.storeCookieSessionInRedisServerToServer(
    userId,
    cookieHeader
  );

  await createUserServerToServer(safeUserId, cookieHeader, parsed);

  // Now fetch userType from Scala backend
  const config = loadConfig();
  let userType: string | null = null;
  try {
    const userData = await $fetch(
      `${config.devQuestBackend.baseUrl}/user/data/${encodeURIComponent(
        userId
      )}`,
      {
        method: "GET",
        headers: {
          cookie: cookieHeader, // Manually inject the cookie header for server to server
        },
      }
    );
    userType = userData?.userType ?? null;
  } catch (err) {
    console.warn(`[callback.ts] User not found in backend: ${err}`);
  }

  // ✅ Set userType into the session after fetching it
  session.user.userType = userType;
  await session.save(); // save updated session

  // Optional cookie for frontend hints
  if (userType) {
    setCookie(event, "user_type", userType, {
      httpOnly: false,
      ttl: 60 * 60 * 8,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      ...(isProd && { domain: ".devirl.com" }),
    });
  }

  return sendRedirect(event, userType ? "/" : "/social-login/sign-up");
});
