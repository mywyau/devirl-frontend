// ./server/api/auth/session.ts
import { sessionOptions } from "~/server/utils/sessionOptions";
import type { AuthUser } from "~/types/AuthUser";
import { createError, eventHandler, SessionData } from "h3";
import { getIronSession } from "iron-session";

export default eventHandler(async (event) => {
  const session = await getIronSession<SessionData>(
    event.node.req,
    event.node.res,
    sessionOptions
  );

  // console.debug("Session content", session); // <- add this

  if (!session.user) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }

  return {
    user: session.user as AuthUser,
  };
});
