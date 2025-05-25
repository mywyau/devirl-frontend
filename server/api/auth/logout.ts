import { defineEventHandler, sendRedirect, setCookie } from 'h3';
import { getIronSession } from 'iron-session';
import { $fetch } from 'ofetch';
import { loadConfig } from '@/configuration/ConfigLoader';

export default defineEventHandler(async (event) => {
  const config = loadConfig();

  const session = await getIronSession(event.node.req, event.node.res, {
    password: process.env.SESSION_SECRET!,
    cookieName: 'auth_session',
  });

  const userId = session.user?.sub;

  // 🔁 Delete session from Redis if it exists
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

  // ❌ Destroy the secure session
  await session.destroy();

  // 🧹 Clear the user_type cookie (frontend-visible role cookie)
  setCookie(event, 'user_type', '', {
    path: '/',
    httpOnly: false, // was set as non-HttpOnly, so this matches
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // ← removes the cookie
  });

  return sendRedirect(event, '/');
});
