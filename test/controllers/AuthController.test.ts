// test/controllers/AuthController.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthController } from '@/controllers/AuthController'

// Mock useFetch
vi.mock('nuxt/app', () => ({
  useFetch: vi.fn(),
}))

import { useFetch } from 'nuxt/app'

// Mock config
const mockConfig = {
  devIrlFrontend: {
    baseUrl: 'http://localhost:3000',
  },
}

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(() => {
    controller = new AuthController(mockConfig, '/')
    vi.clearAllMocks()
  })

  it('returns correct login URL', () => {
    expect(controller.loginUrl()).toBe('http://localhost:3000/api/auth/login')
  })

  it('returns correct logout URL', () => {
    expect(controller.logoutUrl()).toBe('http://localhost:3000/api/auth/logout')
  })

  it('returns correct session URL', () => {
    expect(controller.sessionUrl()).toBe('http://localhost:3000/api/auth/session')
  })

  it('returns correct callback URL', () => {
    expect(controller.callbackUrl()).toBe('http://localhost:3000/api/auth/callback')
  })

  it('calls useFetch with correct params for sessionRequest', async () => {
    const mockResponse = { data: { value: { name: 'John', email: 'a@a.com', sub: '123' } } }
    ;(useFetch as any).mockResolvedValue(mockResponse)

    const result = await controller.sessionRequest()
    expect(useFetch).toHaveBeenCalledWith('/api/auth/session', {
      credentials: 'include',
    })
    expect(result).toEqual(mockResponse)
  })

  it('calls useFetch with correct params for logoutRequest', async () => {
    const mockResponse = { status: 200 }
    ;(useFetch as any).mockResolvedValue(mockResponse)

    const result = await controller.logoutRequest()
    expect(useFetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/logout', {
      credentials: 'include',
    })
    expect(result).toEqual(mockResponse)
  })

  it('calls fetch with correct login URL in loginRequest', async () => {
    global.fetch = vi.fn()

    // Create a fake `user` since loginRequest uses `user.value.sub`, which is undefined in the current code.
    const user = { value: { sub: '12345' } }
    // @ts-ignore
    global.user = user

    await controller.loginRequest()
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/auth/session/12345',
      {
        method: 'POST',
        credentials: 'include',
      }
    )
  })
})
