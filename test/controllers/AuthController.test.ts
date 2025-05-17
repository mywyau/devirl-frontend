import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthController } from '@/controllers/AuthController'

// Mock loadConfig
vi.mock('@/configuration/ConfigLoader', () => ({
  loadConfig: () => ({
    devIrlFrontend: { baseUrl: 'https://devirl.com/' }
  })
}))

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(() => {
    controller = new AuthController()
  })

  it('should return correct login URL', () => {
    expect(controller.loginUrl()).toBe('https://devirl.com/api/auth/login')
  })

  it('should return correct logout URL', () => {
    expect(controller.logoutUrl()).toBe('https://devirl.com/api/auth/logout')
  })

  it('should return correct session URL', () => {
    expect(controller.sessionUrl()).toBe('https://devirl.com/api/auth/session')
  })

  it('should return correct callback URL', () => {
    expect(controller.callbackUrl()).toBe('https://devirl.com/api/auth/callback')
  })
})


import { useFetch } from 'nuxt/app'

// Mock useFetch
vi.mock('nuxt/app', async () => {
  return {
    useFetch: vi.fn()
  }
})

describe('AuthController - async methods', () => {
  let controller: AuthController

  beforeEach(() => {
    vi.clearAllMocks()
    controller = new AuthController()
  })

  it('calls useFetch for sessionRequest()', async () => {
    const mockData = { data: { value: { name: 'Test', email: 'test@example.com', sub: '123' } }, error: null }
    ;(useFetch as any).mockResolvedValueOnce(mockData)

    const result = await controller.sessionRequest()
    expect(useFetch).toHaveBeenCalledWith('/api/auth/session', {
      credentials: 'include'
    })
    expect(result).toEqual(mockData)
  })

  it('calls useFetch for logoutRequest()', async () => {
    const mockResult = { data: { value: null }, error: null }
    ;(useFetch as any).mockResolvedValueOnce(mockResult)

    const result = await controller.logoutRequest()
    expect(useFetch).toHaveBeenCalledWith('https://devirl.com/api/auth/logout', {
      credentials: 'include'
    })
    expect(result).toEqual(mockResult)
  })

  it('calls fetch for loginRequest()', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true })

    // @ts-ignore
    globalThis.user = { value: { sub: 'abc123' } }

    await controller.loginRequest()
    expect(globalThis.fetch).toHaveBeenCalledWith('https://devirl.com/auth/session/abc123', {
      method: 'POST',
      credentials: 'include'
    })
  })
})
