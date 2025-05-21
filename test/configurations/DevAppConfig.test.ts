// test/config/static-config.test.ts
import { describe, it, expect } from 'vitest' // or 'jest'
import { DevAppConfig } from '@/configuration/DevAppConfig'
import { z } from 'zod'

const DevAppConfigSchema = z.object({
  featuresSwitches: z.object({
    payments: z.boolean(),
    auth: z.boolean(),
  }),
  devIrlFrontend: z.object({
    host: z.string(),
    port: z.string(),
    baseUrl: z.string(),
  }),
  devQuestBackend: z.object({
    host: z.string(),
    port: z.string(),
    baseUrl: z.string(),
  }),
})

describe('DevAppConfig', () => {
  it('should have valid structure', () => {
    expect(DevAppConfig).toMatchObject({
      featuresSwitches: {
        payments: true,
        auth: true,
      },
      devIrlFrontend: {
        host: 'localhost',
        port: '3000',
        baseUrl: 'http://localhost:3000',
      },
      devQuestBackend: {
        host: 'localhost',
        port: '8080',
        baseUrl: 'http://localhost:8080/dev-quest-service',
      },
    })
  })

  it('should reject invalid config shape', () => {
    const invalidConfig = {
      featuresSwitches: {
        payments: 'yes', // should be boolean
        auth: true,
      },
      devIrlFrontend: {
        host: 'localhost',
        port: '3000',
        baseUrl: 'http://localhost:3000',
      },
      devQuestBackend: {
        host: 'localhost',
        port: '8080',
        baseUrl: 'http://localhost:8080',
      },
    }

    expect(() => DevAppConfigSchema.parse(invalidConfig)).toThrow()
  })
})
