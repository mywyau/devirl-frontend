import { z } from "zod";

export const RewardDataSchema = z.object({
  questId: z.string(),
  clientId: z.string(),
  devId: z.string().nullable().optional(),
  timeRewardValue: z.number().nullable().optional(),
  completionRewardValue: z.number().nullable().optional(),
  paid: z.enum(["Paid", "NotPaid", "Pending"]),
});

export type RewardData = z.infer<typeof RewardDataSchema>;
