import { z } from "zod";

export const RewardDataSchema = z.object({
  questId: z.string(),
  clientId: z.string(),
  devId: z.string().nullable().optional(),
  rewardValue: z.number().nullable().optional(),
  paid: z.boolean(),
});

export type RewardData = z.infer<typeof RewardDataSchema>;
