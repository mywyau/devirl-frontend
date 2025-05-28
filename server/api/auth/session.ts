// ./server/api/auth/session.ts

import { sessionOptions } from "@/server/utils/sessionOptions"; // update path as needed

// This handler provides access to the current user's session using iron-session.
import { eventHandler } from "h3"; // Nuxt 3's event handler for API routes
import { getIronSession } from "iron-session"; // iron-session handles encrypted cookie-based session management

// Check whether the app is running in production
const isProd = process.env.NODE_ENV === "production";

// Define iron-session options
// const sessionOptions = {
//   password: process.env.SESSION_SECRET!, // 🔐 Used to encrypt/decrypt session data (must be at least 32 characters)
//   cookieName: "auth_session",            // 🍪 Name of the session cookie in the browser

//   // Configuration for how the session cookie behaves
//   cookieOptions: {
//     secure: isProd,                      // ✅ Only send cookie over HTTPS in production
//     httpOnly: true,                      // 🚫 Not accessible via JavaScript on the client
//     sameSite: "none",                    // 🌐 Required for cross-origin cookies (Auth0 redirects, etc.)
//     path: "/",                           // 📁 Cookie is valid for the whole site
//     ...(isProd && { domain: ".devirl.com" }) // 🌍 Share the cookie across subdomains in production
//   },
// };

// Export an event handler used in a Nuxt 3 server route (e.g. `/api/auth/user`)
export default eventHandler(async (event) => {
  // Retrieve the session for the current request using iron-session
  const session = await getIronSession(
    event.node.req,       // Node.js-style incoming request
    event.node.res,       // Node.js-style outgoing response
    sessionOptions        // Cookie + session encryption settings
  );

  // If the session has no `user` object, return null (unauthenticated)
  if (!session.user) return null;

  // Otherwise return the stored user object from the session
  return session.user;
});
