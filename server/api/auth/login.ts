import { defineEventHandler, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const redirectTo = `https://${process.env.NUXT_PUBLIC_AUTH0_DOMAIN}/authorize?` + new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID!,
    redirect_uri: `${process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL}`,
    scope: 'openid profile email'
  })

  return sendRedirect(event, redirectTo)
})
