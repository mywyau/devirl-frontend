import { defineEventHandler, sendRedirect } from 'h3'
import { getIronSession } from 'iron-session'
import { $fetch } from 'ofetch' // if not already globally available
import { loadConfig } from '@/configuration/ConfigLoader' // adjust based on your setup

export default defineEventHandler(async (event) => {
  
  const config = loadConfig(); // ensure it has your backend base URL

  const session = await getIronSession(event.node.req, event.node.res, {
    password: process.env.SESSION_SECRET!,
    cookieName: 'auth_session',
  });

  const userId = session.user?.sub;

  if (userId) {
    try {
      const url = `${config.devQuestBackend.baseUrl}/auth/session/delete/${encodeURIComponent(userId)}`;
      console.info(`[Logout] Deleting Redis session for ${userId}`);
      await $fetch(url, { method: 'DELETE' });
    } catch (err) {
      console.warn(`[Logout] Failed to delete Redis session for ${userId}`, err);
    }
  } else {
    console.warn(`[Logout] No user found in session; skipping Redis delete.`);
  }

  await session.destroy();

  return sendRedirect(event, '/');
});
