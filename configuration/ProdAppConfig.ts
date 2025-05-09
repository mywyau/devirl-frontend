// configuration/ProdAppConfig.ts
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
    baseUrl: 'https://devirl.com',
  },
})

export type ProdAppConfig = z.infer<typeof ProdAppConfigSchema>


curl -v \
  -H "Cookie: auth_session=<YOUR_ENCODED_SESSION_COOKIE>" \
  "https://devirl.com/dev-quest-service/quest/stream/$(printf '%s' 'google-oauth2|115481780172182428557' | jq -s -R -r @uri)?page=1&limit=10"
