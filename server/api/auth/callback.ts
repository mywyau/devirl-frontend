import {
  authenticateUser,
  fetchUserType,
  getAccessToken,
  setUserTypeCookie,
  storeSession,
  syncSessionToBackend,
  syncUserToBackend,
} from "@/utils/CallbackHelpers";
import { defineEventHandler, sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
  const { code } = getQuery(event);
  console.debug("code", code);

  if (!code || typeof code !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Missing code" });
  }

  const isProd = process.env.NODE_ENV === "production";
  console.debug("[isProd] ", isProd);

  const accessToken = await getAccessToken(code);
  const { user, userId } = await authenticateUser(accessToken);
  const cookieHeader = await storeSession(event, user);
  await syncUserToBackend(user, userId, cookieHeader);

  const userType = await fetchUserType(userId, cookieHeader);

  if (userType) {
    await syncSessionToBackend(userId, cookieHeader);
    setUserTypeCookie(event, userType);
  }

  return sendRedirect(event, userType ? "/" : "/choose-user-type");
});
