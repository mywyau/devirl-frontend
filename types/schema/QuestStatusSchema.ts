import { z } from "zod";

// Zod schema
export const QuestStatusSchema = z.enum([
  "NotStarted",
  "InProgress",
  "Completed",
  "Failed",
  "Review",
  "Open",
]);

// Inferred TypeScript type from Zod
export type QuestStatus = z.infer<typeof QuestStatusSchema>;

export const QuestPartialSchema = z.object({
  questId: z.string(),
  clientId: z.string(),
  devId: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: QuestStatusSchema,
});

export type QuestPartial = z.infer<typeof QuestPartialSchema>;
