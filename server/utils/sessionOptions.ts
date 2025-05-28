const isProd = process.env.NODE_ENV === 'production';

// export const sessionOptions = {
//   password: process.env.SESSION_SECRET!,
//   cookieName: 'auth_session',
//   ttl: 60 * 60 * 8,
//   cookieOptions: {
//     secure: isProd,
//     // httpOnly: true,
//     sameSite: 'none',
//     path: '/',
//     ...(isProd && { domain: '.devirl.com' }),
//   },
// };

// Configure the iron-session options
export const sessionOptions = {
  password: process.env.SESSION_SECRET!, // encryption secret for the session
  cookieName: "auth_session", // name of the session cookie
  ttl: 60 * 60 * 8, // session lifespan: 8 hours
  secure: isProd, // only send over HTTPS in production
  sameSite: "none", // needed for cross-site cookies (e.g., Auth0)
  path: "/",
  ...(isProd && { domain: ".devirl.com" }), // domain-scoped cookie in prod
};