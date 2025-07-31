// types/AddRewardForm.ts
import { z } from "zod";

const validateTwoDecimals = (val: number): boolean => Number.isInteger(val * 100);

export const AddTimeRewardSchema = z.object({
  timeRewardAmount: z
    .number({ required_error: "Time reward is required" })
    .superRefine((val, ctx) => {
      if (val < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Time reward cannot be negative",
        });
      } else if (val > 0 && val < 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: "number",
          minimum: 0.01,
          inclusive: true,
          message: "Time reward must be at least 0.01 or exactly 0",
        });
      }

      if (!validateTwoDecimals(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Time reward must have at most 2 decimal places",
        });
      }
    }),
});


export type AddTimeRewardForm = z.infer<typeof AddTimeRewardSchema>;
