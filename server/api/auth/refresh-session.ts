// server/api/auth/refresh-session.ts
import { defineEventHandler, setCookie } from "h3";
import { getIronSession } from "iron-session";
import { loadConfig } from "@/configuration/ConfigLoader";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";

const isProd = process.env.NODE_ENV === "production";

export default defineEventHandler(async (event) => {
  const session = await getIronSession(event.node.req, event.node.res, {
    password: process.env.SESSION_SECRET!,
    cookieName: "auth_session",
    ttl: 60 * 60 * 8,
    secure: isProd,
    sameSite: "none",
    path: "/",
    ...(isProd && { domain: ".devirl.com" }),
  });

  const userId = session.user?.sub;
  if (!userId) {
    throw createError({ statusCode: 401, message: "User not authenticated" });
  }

  const config = loadConfig();

  const allCookies = event.node.req.headers.cookie || "";
  const sessionCookie = allCookies
    .split(";")
    .find((c) => c.trim().startsWith("auth_session="));

  console.log(sessionCookie); // Debug: see what's being sent as cookie header

  // Refetch updated user data (including userType)
  const userData = await $fetch(
    `${config.devQuestBackend.baseUrl}/user/data/${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: {
        cookie: sessionCookie ?? "",
      },
    }
  );

  const userType = userData?.userType ?? null;

  // Update session with new userType
  session.user.userType = userType;
  await session.save();

  // Optionally update frontend hint cookie
  if (userType) {
    setCookie(event, "user_type", userType, {
      httpOnly: false,
      path: "/",
      sameSite: "lax",
      secure: isProd,
      maxAge: 60 * 60 * 8,
    });
  }

  return { success: true, userType };
});
