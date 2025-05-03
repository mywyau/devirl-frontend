// composables/useAuthedFetch.ts
import { useAuth0 } from '@auth0/auth0-vue'

export const useAuthedFetch = async (url: string, options: RequestInit = {}) => {
  const { getAccessTokenSilently } = useAuth0()
  const token = await getAccessTokenSilently()

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
}
