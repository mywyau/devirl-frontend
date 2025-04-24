import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  nuxtApp.vueApp.use(createAuth0({
    domain: config.public.auth0Domain,
    client_id: config.public.auth0ClientId,
    redirect_uri: window.location.origin,
    audience: config.public.auth0Audience,
  }))
})
