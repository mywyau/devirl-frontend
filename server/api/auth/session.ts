import { getIronSession } from 'iron-session';
import { eventHandler, getRequestHeaders } from 'h3';

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'auth_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
};

export default eventHandler(async (event) => {
  const absoluteUrl = `http://${event.node.req.headers.host}${event.node.req.url}`;
  const req = new Request(absoluteUrl, {
    headers: getRequestHeaders(event),
    method: event.node.req.method,
  });

  const res = {
    headers: new Headers(),
    getHeader: (name: string) => res.headers.get(name),
    setHeader: (name: string, value: string) => res.headers.set(name, value),
  };

  const session = await getIronSession(req, res, sessionOptions);

  if (!session.user) return null;

  return session.user;
});
