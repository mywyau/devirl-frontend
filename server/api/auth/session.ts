// ./server/api/auth/session.ts
import { sessionOptions } from "@/server/utils/sessionOptions";
import { eventHandler, createError } from "h3";
import { getIronSession } from "iron-session";
import type { AuthUser } from "@/types/auth"; // your custom user type

export default eventHandler(async (event) => {
  const session = await getIronSession(event.node.req, event.node.res, sessionOptions);

  if (!session.user) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }

  return {
    user: session.user as AuthUser,
  };
});
