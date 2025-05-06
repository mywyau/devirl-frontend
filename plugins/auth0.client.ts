// plugins/auth0.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public

  nuxtApp.vueApp.use(createAuth0, {
    domain: config.auth0Domain,
    clientId: config.auth0ClientId,
    authorizationParams: {
      redirect_uri: config.auth0CallbackUrl,
      scope: 'openid profile email',
    },
    cacheLocation: 'memory', // Or 'localstorage' if needed
    useRefreshTokens: true,
  })
})
