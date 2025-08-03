import { z } from "zod";
import { QuestPartialSchema } from "./QuestStatusSchema";

export type EstimationExpiration = z.infer<typeof EstimationExpirationSchema>;

export const EstimationExpirationSchema = z.object({
  quest: QuestPartialSchema,
  estimationCloseAt: z.string().datetime().optional().nullable(),
});
