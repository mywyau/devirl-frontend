import { eventHandler } from "h3";
import { getIronSession } from "iron-session";

const isProd = process.env.NODE_ENV === "production";

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "auth_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    // sameSite: isProd ? "none" : "lax", // use lax locally to avoid silent cookie rejection
    sameSite: "none",
    path: "/",
    ...(isProd && { domain: ".devirl.com" }), // optionally set domain for subdomain sharing
  },
};

export default eventHandler(async (event) => {
  const session = await getIronSession(
    event.node.req,
    event.node.res,
    sessionOptions
  );

  if (!session.user) return null;

  return session.user;
});
