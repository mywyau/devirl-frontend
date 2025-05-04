// middleware/auth.global.ts

// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Only run this middleware on the server
  if (process.server) {
    const event = useRequestEvent();
    if (!event) return;

    const { getIronSession } = await import("iron-session");
    const session = await getIronSession(event.node.req, event.node.res, {
      password: process.env.SESSION_SECRET!,
      cookieName: "auth_session",
      ttl: 60 * 60 * 8, // 8 hours
    });

    const user = session.user;
    if (!user && to.path !== "/") {
      return navigateTo("/");
    }
  }
});
