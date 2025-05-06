// config/static-config.ts
import { z } from 'zod'

const ProdAppConfigSchema = z.object({
  featuresSwitches: z.object({
    payments: z.boolean(),
    auth: z.boolean(),
  }),
  devIrlFrontend: z.object({
    host: z.string(), // or .nullable().optional() if unset
    port: z.string(),
    baseUrl: z.string().url(),
  }),
  devQuestBackend: z.object({
    host: z.string(),
    port: z.string(),
    baseUrl: z.string().url(),
  }),
})

export const ProdAppConfig = ProdAppConfigSchema.parse({
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
    baseUrl: 'https://api.devirl.com/',
  },
})

export type ProdAppConfig = z.infer<typeof ProdAppConfigSchema>
