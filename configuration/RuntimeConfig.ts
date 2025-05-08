// configuration/RuntimeConfig.ts
import { z } from "zod";

export const RuntimeConfigSchema = z.object({
  apiBase: z.string(),
  auth0Domain: z.string(),
  auth0ClientId: z.string(),
  auth0Audience: z.string(),
  auth0CallbackUrl: z.string()
});

export type RuntimeConfig = z.infer<typeof RuntimeConfigSchema>;
