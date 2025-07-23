import { z } from "zod";

export const TotalLevelSchema = z.object({
  devId: z.string(),
  username: z.string(),
  totalLevel: z.number(),
  totalXP: z.number(),
}
);

export type TotalLevel = z.infer<typeof TotalLevelSchema>;
