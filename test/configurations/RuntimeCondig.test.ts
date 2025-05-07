// test/configuration/RuntimeConfig.test.ts
import { describe, it, expect } from 'vitest'
import { RuntimeConfigSchema } from '@/configuration/RuntimeConfig'

describe('RuntimeConfigSchema', () => {
  const validConfig = {
    apiBase: 'http://localhost:8080',
    auth0Domain: 'your-domain.auth0.com',
    auth0ClientId: 'client_123',
    auth0Audience: 'https://api.example.com',
    auth0CallbackUrl: 'http://localhost:3000/callback',
  }

  it('passes validation with valid config', () => {
    const parsed = RuntimeConfigSchema.parse(validConfig)
    expect(parsed).toEqual(validConfig)
  })

  it('fails validation when a required field is missing', () => {
    const invalidConfig = { ...validConfig }
    delete invalidConfig.auth0ClientId

    expect(() => RuntimeConfigSchema.parse(invalidConfig)).toThrow()
  })

  it('fails validation when a field has the wrong type', () => {
    const invalidConfig = { ...validConfig, apiBase: 123 }

    expect(() => RuntimeConfigSchema.parse(invalidConfig)).toThrow()
  })

  it('fails validation when an extra field is present (optional)', () => {
    const configWithExtraField = {
      ...validConfig,
      extra: 'not allowed',
    }

    // strict by default – Zod will ignore unknown keys unless you use `.strict()`
    const result = RuntimeConfigSchema.parse(configWithExtraField)

    expect(result).not.toHaveProperty('extra')
  })
})
