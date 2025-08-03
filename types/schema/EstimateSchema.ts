import { z } from "zod";

export const CreateEstimateSchema = z.object({
  questId: z.string(),
  score: z.number().min(1, "Score must be between 1 and 100").max(100),
  hours: z.number().min(1, "Hours must be be between 1 and 150").max(150),
  comment: z
    .string()
    .trim()
    .min(1, { message: "Please enter a comment." })
    .max(2000, { message: "Comment must be 2000 characters or fewer." }),
});

export type CreateEstimate = z.infer<typeof CreateEstimateSchema>;

export const CalculatedEstimateSchema = z.object({
  username: z.string(),
  score: z.number().min(1, "Score must be between 1 and 100").max(100),
  hours: z.number().min(1, "Days must be be between 1 and 150").max(150),
  rank: z.string(),
  comment: z
    .string()
    .trim()
    .min(1, { message: "Please enter a comment." })
    .max(2000, { message: "Comment must be 2000 characters or fewer." }),
});

export type CalculatedEstimate = z.infer<typeof CalculatedEstimateSchema>;

export const GetEstimateSchema = z.object({
  estimationStatus: z.string(),
  calculatedEstimate: z.array(CalculatedEstimateSchema),
});

export type GetEstimate = z.infer<typeof GetEstimateSchema>;
