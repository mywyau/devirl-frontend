import { defineEventHandler, getQuery, sendRedirect } from "h3";
import { getIronSession } from "iron-session";
import { exchangeCodeForToken, getUserInfo } from "~/server/utils/auth0";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";

const isProd = process.env.NODE_ENV === "production";

// Session options
const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "auth_session",
  ttl: 60 * 60 * 8, // 8 hours
  secure: process.env.NODE_ENV === "production",
  sameSite: "none", // ✅ cross-site cookie needed
  path: "/",
  ...(isProd && { domain: ".devirl.com", sameSite: "none" }), // only set for prod
};

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event);

  // Exchange code for tokens
  const redirectUri = `${process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL}`;

  const { access_token, id_token } = await exchangeCodeForToken(
    code as string,
    redirectUri
  );

  // Get user info using access token
  const user = await getUserInfo(access_token);
  console.log(`[callback.ts] `, user);

  // Create session
  const session = await getIronSession(
    event.node.req,
    event.node.res,
    sessionOptions
  );

  const userId = user?.sub ?? "No user id";
  session.user = user;

  await session.save();

  const cookieHeaderRaw = event.node.res.getHeader("Set-Cookie");
  const cookieHeader = Array.isArray(cookieHeaderRaw)
    ? cookieHeaderRaw.map((h) => h.split(";")[0]).join("; ")
    : String(cookieHeaderRaw).split(";")[0];

  const devQuestBackendAuthController = new DevQuestBackendAuthController();

  const result =
    await devQuestBackendAuthController.storeCookieSessionInRedisServerToServer(
      userId,
      cookieHeader
    );

  return sendRedirect(event, "/");
});
