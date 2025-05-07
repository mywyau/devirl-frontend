// configuration/DevAppConfig.ts
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

export const DevAppConfig = DevAppConfigSchema.parse({
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
    baseUrl: 'http://localhost:8080',
  },
})

export type DevAppConfig = z.infer<typeof DevAppConfigSchema>
