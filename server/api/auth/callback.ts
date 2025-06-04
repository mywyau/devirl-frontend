import {
  authenticateUser,
  fetchUserType,
  getAccessToken,
  setUserTypeCookie,
  storeSession,
  syncSessionToBackend,
  syncUserToBackend
} from "@/utils/CallbackHelpers";
import {
  defineEventHandler,
  sendRedirect
} from "h3";

const isProd = process.env.NODE_ENV === "production";
console.log("[isProd] ", isProd);

export default defineEventHandler(async (event) => {
  const accessToken = await getAccessToken(event);
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
