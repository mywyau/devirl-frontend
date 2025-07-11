import { z } from "zod";

export const CreateEstimateSchema = z.object({
  questId: z.string(),
  score: z.number().min(1, "Score must be between 1 and 100").max(100),
  days: z.number().min(1, "Days must be be between 1 and 10").max(10),
  comment: z.string(),
});

export type CreateEstimate = z.infer<typeof CreateEstimateSchema>;

export const CalculatedEstimateSchema = z.object({
  username: z.string(),
  score: z.number().min(1, "Score must be between 1 and 100").max(100),
  days: z.number().min(1, "Days must be be between 1 and 10").max(10),
  rank: z.string(),
  comment: z.string(),
});

export type CalculatedEstimate = z.infer<typeof CalculatedEstimateSchema>;

export const GetEstimateSchema = z.object({
  estimationStatus: z.string(),
  calculatedEstimate: z.array(CalculatedEstimateSchema),
});

export type GetEstimate = z.infer<typeof GetEstimateSchema>;
