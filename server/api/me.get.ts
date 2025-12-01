// server/api/me.get.ts

import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/server/utils/sessionOptions';
import { loadConfig } from '@/configuration/ConfigLoader';

export default defineEventHandler(async (event) => {

  const session = await getIronSession(event.node.req, event.node.res, sessionOptions);

  // Step 1 — Check if user is logged in
  if (!session.user) {
    throw createError({ statusCode: 401, message: "Not logged in" });
  }

  const userId = session.user.id;
  const config = loadConfig();

  // Step 2 — Check backend for user registration data
  try {
    const userData = await $fetch(
      `${config.devirlAuthBackend.baseUrl}/registration/account/data/${encodeURIComponent(userId)}`,
      {
        headers: {
          cookie: event.node.req.headers.cookie ?? "",
        }
      }
    );

    return {
      isRegistered: true,
      userType: userData.userType,
      user: session.user,
    };
  } catch (err) {
    // If backend returns 404 → user still needs to register
    return {
      isRegistered: false,
      userType: null,
      user: session.user,
    };
  }
});
