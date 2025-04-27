import { ref, onMounted } from 'vue'
import type { User } from '@auth0/auth0-spa-js'
import { useAuth } from '@/composables/useAuth'

// export const useUser = () => {
//   const auth = useAuth()
//   const user = ref<User | null>(null)
//   const isLoggedIn = ref<boolean | null>(null) // null = still checking

//   const fetchUser = async () => {
//     const authenticated = await auth.isAuthenticated()
//     isLoggedIn.value = authenticated

//     if (authenticated) {
//       user.value = (await auth.getUser()) ?? null
//     }
//   }

//   onMounted(fetchUser)

//   return {
//     user,
//     isLoggedIn,
//   }
// }

const user = ref<User | null>(null)
const isLoggedIn = ref<boolean | null>(null)

export const useUser = () => {
  const auth = useAuth()

  onMounted(async () => {
    const loggedIn = await auth.isAuthenticated()
    isLoggedIn.value = loggedIn
    user.value = loggedIn ? (await auth.getUser()) ?? null : null
  })

  return {
    user,
    isLoggedIn,
  }
}
