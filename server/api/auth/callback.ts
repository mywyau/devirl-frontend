import { defineEventHandler, getQuery, sendRedirect } from "h3";
import { getIronSession } from "iron-session";
import { exchangeCodeForToken, getUserInfo } from "~/server/utils/auth0";

// Session options
const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "auth_session",
  ttl: 60 * 60 * 8, // 8 hours
};

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event);

  // if (!code || typeof code !== 'string') {
  //   return sendRedirect(event, '/login?error=missing_code')
  // }

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

  session.user = user;

  await session.save();

  // try to save the session cookie to backend -> redis
  // const data = await useFetch("/api/auth/session", {
  //   credentials: "include",
  // });

  // await fetch(`http://localhost:8080/auth/session/${data.user?.sub}`, {
  //   method: "POST",
  //   headers: { "Content-Type": "text/plain" },
  //   // body: token, // <- required for your backend to store the session
  //   credentials: "include",
  // });

  return sendRedirect(event, "/login/success");
});
