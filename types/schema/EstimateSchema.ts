import { z } from "zod";

export const CreateEstimateSchema = z.object({
  questId: z.string(),
  rank: z.string(),
  comment: z.string()
});

export type CreateEstimate = z.infer<typeof CreateEstimateSchema>;


export const GetEstimateSchema = z.object({
  username: z.string(),
  rank: z.string(),
  comment: z.string()
});

export type GetEstimate = z.infer<typeof GetEstimateSchema>;
