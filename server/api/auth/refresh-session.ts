// server/api/auth/refresh-session.ts
import { $fetch } from "ofetch";
import { defineEventHandler, setCookie, createError } from "h3";
import { getIronSession } from "iron-session";
import { loadConfig } from "@/configuration/ConfigLoader";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";
import { sessionOptions } from "@/server/utils/sessionOptions"; // ✅ import the shared options

const isProd = process.env.NODE_ENV === "production";

export default defineEventHandler(async (event) => {

  const session = await getIronSession(
    event.node.req,
    event.node.res,
    sessionOptions
  );

  const userId = session.user?.sub;
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not authenticated",
    });
  }

  const config = loadConfig();

  const allCookies = event.node.req.headers.cookie || "";


  console.log(`allCookies: ${allCookies}\n`, ); // Debug: see what's being sent as cookie header

  const sessionCookie = allCookies
    .split(";")
    .find((c) => c.trim().startsWith("auth_session="));

  console.log(`session cookie: ${sessionCookie}\n`, ); // Debug: see what's being sent as cookie header

  // Refetch updated user data (including userType)
  const userData = await $fetch(
    `${config.devQuestBackend.baseUrl}/registration/user/data/${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: {
        cookie: sessionCookie ?? "",
      },
    }
  );

  const userType = userData?.userType ?? null;
  
  await session.save();

  console.log(sessionCookie)

  try {
    const response = await $fetch(
      `${config.devQuestBackend.baseUrl}/auth/session/sync/${encodeURIComponent(
        userId
      )}`,
      {
        method: "POST",
        headers: {
          cookie: sessionCookie ?? "",
        },
      }
    );
  } catch (err) {
    console.warn(
      `[callback.ts] Auth session not synced in backend cache from db: ${err}`
    );
  }

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
