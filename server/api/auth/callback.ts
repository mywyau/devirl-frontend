// import { sessionOptions } from "@/server/utils/sessionOptions";
// import {
//   createError,
//   defineEventHandler,
//   getQuery,
//   sendRedirect,
//   setCookie,
// } from "h3";
// import { getIronSession } from "iron-session";
// // import { useRuntimeConfig } from "#imports";
// import { loadConfig } from "@/configuration/ConfigLoader";
// import { createUserNuxtServerToScalaServer } from "@/connectors/RegistrationConnector";
// import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";
// import { exchangeCodeForToken, getUserInfo } from "@/server/utils/auth0";
// import {
//   LoginUserDataSchema
// } from "@/types/schema/UserDataSchema";

import { sessionOptions } from "@/server/utils/sessionOptions";
import {
  createError,
  defineEventHandler,
  getQuery,
  sendRedirect
} from "h3";
import { getIronSession } from "iron-session";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";
import { exchangeCodeForToken, getUserInfo } from "@/server/utils/auth0";

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event);
  if (!code || typeof code !== "string") {
    throw createError({ statusCode: 400, message: "Missing code" });
  }

  const redirectUri = process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL!;
  const { access_token } = await exchangeCodeForToken(code, redirectUri);

  const auth0User = await getUserInfo(access_token);
  const userId = auth0User?.sub;
  if (!userId)
    throw createError({ statusCode: 400, message: "Missing user ID" });

  // Create iron session
  const session = await getIronSession(
    event.node.req,
    event.node.res,
    sessionOptions
  );
  session.user = {
    id: userId,
    email: auth0User.email,
    name: auth0User.name,
    picture: auth0User.picture,
  };
  await session.save();

  console.log("Session user saved:", session.user);


  // Extract session cookie
  const rawSetCookieHeader = event.node.res.getHeader("Set-Cookie") ?? "";
  const cookieHeader = Array.isArray(rawSetCookieHeader)
    ? rawSetCookieHeader.map((h) => h.split(";")[0]).join("; ")
    : String(rawSetCookieHeader).split(";")[0];

  // Sync session into Redis (server->server)
  const backendController = new DevQuestBackendAuthController();
  await backendController.storeCookieSessionInRedisServerToServer(
    userId,
    cookieHeader
  );

  // Always redirect to the post-login flow
  return sendRedirect(event, "/post-login");
});

// OLD messy event handler

// export default defineEventHandler(async (event) => {
//   const { code } = getQuery(event);
//   const isProd = process.env.NODE_ENV === "production";

//   if (!code || typeof code !== "string") {
//     throw createError({ statusCode: 400, statusMessage: "Missing code" });
//   }

//   // const redirectUri = runtimeConf.public.auth0CallbackUrl!;
//   const redirectUri = process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL!;
//   const { access_token } = await exchangeCodeForToken(code, redirectUri);
//   const user = await getUserInfo(access_token);
//   const userId = user?.sub;

//   if (!userId) {
//     throw createError({ statusCode: 400, statusMessage: "Missing user ID" });
//   }

//   const session = await getIronSession(
//     event.node.req,
//     event.node.res,
//     sessionOptions
//   );
//   session.user = user;
//   await session.save();

//   const rawSetCookieHeader = event.node.res.getHeader("Set-Cookie");
//   const cookieHeader = Array.isArray(rawSetCookieHeader)
//     ? rawSetCookieHeader.map((h) => h.split(";")[0]).join("; ")
//     : String(rawSetCookieHeader).split(";")[0];

//   const parsed = LoginUserDataSchema.parse({
//     email: user.email,
//   });

//   const backendController = new DevQuestBackendAuthController();
//   await backendController.storeCookieSessionInRedisServerToServer(
//     userId,
//     cookieHeader
//   );
//   // await createUserNuxtServerToScalaServer(userId, cookieHeader, parsed);

//   const config = loadConfig();
//   let userType: string | null = null;

//   try {
//     const userData = await $fetch(
//       `${config.devQuestBackend.baseUrl}/registration/user/data/${encodeURIComponent(userId)}`,
//       {
//         method: "GET",
//         headers: { cookie: cookieHeader },
//       }
//     );
//     userType = userData?.userType ?? null;
//   } catch (err) {
//     console.log("[callback.ts] User not found in backend:", err);
//   }

//   if (userType) {
//     try {
//       await $fetch(
//         `${config.devQuestBackend.baseUrl}/auth/session/sync/${encodeURIComponent(userId)}`,
//         {
//           method: "POST",
//           headers: { cookie: cookieHeader },
//         }
//       );
//     } catch (err) {
//       console.log(
//         "[callback.ts] Auth session not synced in backend cache from db:",
//         err
//       );
//     }

//     setCookie(event, "user_type", userType, {
//       httpOnly: false,
//       secure: isProd,
//       maxAge: 60 * 60 * 8,
//       sameSite: "lax",
//       path: "/",
//       ...(isProd && { domain: ".devirl.com" }),
//     });
//   }

//   return sendRedirect(event, userType ? "/" : "/registration");
// });
