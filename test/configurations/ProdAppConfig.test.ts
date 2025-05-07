// test/config/static-config.test.ts
import { describe, it, expect } from 'vitest' // or 'jest'
import { ProdAppConfig } from '@/configuration/ProdAppConfig'
import { z } from 'zod'

const ProdAppConfigSchema = z.object({
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

describe('ProdAppConfig', () => {
  it('should have valid structure', () => {
    expect(ProdAppConfig).toMatchObject({
      featuresSwitches: {
        payments: true,
        auth: true,
      },
      devIrlFrontend: {
        host: '',
        port: '',
        baseUrl: 'https://devirl.com',
      },
      devQuestBackend: {
        host: '',
        port: '',
        baseUrl: 'https://api.devirl.com',
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
        host: '',
        port: '',
        baseUrl: 'https://devirl.com',
      },
      devQuestBackend: {
        host: '',
        port: '',
        baseUrl: 'https://api.devirl.com/',
      },
    }

    expect(() => ProdAppConfigSchema.parse(invalidConfig)).toThrow()
  })
})
