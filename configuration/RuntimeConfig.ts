// configuration/RuntimeConfig.ts
import { z } from "zod";

export const RuntimeConfigSchema = z.object({
  auth0Domain: z.string().url(),
  auth0ClientId: z.string().min(1),
  auth0CallbackUrl: z.string().url(),
});

export type RuntimeConfig = z.infer<typeof RuntimeConfigSchema>;
