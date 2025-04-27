import { defineNuxtRouteMiddleware } from "nuxt/app"
import { useAuth } from '@/composables/useAuth'


export default defineNuxtRouteMiddleware(async () => {
    const { isAuthenticated, login } = useAuth()
    const loggedIn = await isAuthenticated()
  
    if (!loggedIn) {
      return login()
    }
  })
  