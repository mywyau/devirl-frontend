import { defineEventHandler, sendRedirect } from 'h3'
import { getIronSession } from 'iron-session'

export default defineEventHandler(async (event) => {
  const session = await getIronSession(event.node.req, event.node.res, {
    password: process.env.SESSION_SECRET!,
    cookieName: 'auth_session',
  })

  await session.destroy()

  return sendRedirect(event, '/')
})
