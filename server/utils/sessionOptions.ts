// ./server/utils/sessionOptions

import { useRuntimeConfig } from "#imports"; // ✅ allowed in server routes
const runtimeConf = useRuntimeConfig();

const sessionSecret = runtimeConf.public.sessionSecret

const isProd = process.env.NODE_ENV === "production";

// Configure the iron-session options
export const sessionOptions = {
  password: sessionSecret!, // encryption secret for the session
  cookieName: "auth_session", // name of the session cookie
  ttl: 60 * 60 * 8, // session lifespan: 8 hours
  // sameSite: "lax",
  secure: isProd, // only send over HTTPS in production
  sameSite: "none", // needed for cross-site cookies (e.g., Auth0)
  path: "/",
  ...(isProd && { domain: ".devirl.com" }), // domain-scoped cookie in prod
};
