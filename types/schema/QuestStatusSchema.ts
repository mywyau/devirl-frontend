
import { z } from "zod";

// Zod schema
export const QuestStatusSchema = z.enum(["NotStarted", "InProgress", "Completed"]);

// Inferred TypeScript type from Zod
export type QuestStatus = z.infer<typeof QuestStatusSchema>;

export const QuestPartialSchema = z.object({
  userId: z.string(),
  questId: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: QuestStatusSchema,
});

export type QuestPartial = z.infer<typeof QuestPartialSchema>;
