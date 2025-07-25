import { z } from "zod";
import { RewardDataSchema } from "./RewardSchema";

// Zod schema
export const QuestStatusSchema = z.enum([
  "NotEstimated",
  "Estimated",
  "Open",
  "NotStarted",
  "InProgress",
  "Review",
  "Completed",
  "Failed",
]);

// Inferred TypeScript type from Zod
export type QuestStatus = z.infer<typeof QuestStatusSchema>;

export const QuestPartialSchema = z.object({
  questId: z.string(),
  clientId: z.string(),
  devId: z.string().nullable().optional(),
  rank: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  acceptanceCriteria: z.string().nullable().optional(),
  status: QuestStatusSchema,
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  estimated: z.boolean()
});

export type QuestPartial = z.infer<typeof QuestPartialSchema>;

export const UpdateQuestStatusSchema = z.object({
  questStatus: QuestStatusSchema,
});

export type UpdateQuestStatus = z.infer<typeof UpdateQuestStatusSchema>;

export const CreateQuestSchema = z.object({
  rank: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  acceptanceCriteria: z.string().nonempty("Acceptance criteria is required"),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(5, "You can choose up to 5 tags"),
});

export type CreateQuestSchema = z.infer<typeof CreateQuestSchema>;

export const CompleteQuestSchema = z.object({
  rank: z.string(),
  questStatus: QuestStatusSchema,
});

export type CompleteQuestPayload = z.infer<typeof CompleteQuestSchema>;

export const QuestWithRewardSchema = z.object({
  quest: QuestPartialSchema,
  reward: RewardDataSchema,
});

export type QuestWithReward = z.infer<typeof QuestWithRewardSchema>;
