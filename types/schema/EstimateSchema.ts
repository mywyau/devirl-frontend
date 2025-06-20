import { z } from "zod";

export const CreateEstimateSchema = z.object({
  questId: z.string(),
  rank: z.string(),
  comments: z.string()
});

export type CreateEstimate = z.infer<typeof CreateEstimateSchema>;
