// types/AddRewardForm.ts
import { z } from "zod";

const validateTwoDecimals = (val: number): boolean => Number.isInteger(val * 100);

export const AddCompletionBonusRewardSchema = z.object({
  completionRewardAmount: z
    .number({ required_error: "Completion reward is required" })
    .superRefine((val, ctx) => {
      if (val < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Completion reward cannot be negative",
        });
      } else if (val > 0 && val < 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: "number",
          minimum: 0.01,
          inclusive: true,
          message: "Completion reward must be at least 0.01 or exactly 0",
        });
      }

      if (!validateTwoDecimals(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Completion reward must have at most 2 decimal places",
        });
      }
    }),
});


export type AddCompletionBonusRewardForm = z.infer<typeof AddCompletionBonusRewardSchema>;
