// types/AddRewardForm.ts
import { z } from "zod";

const validateTwoDecimals = (val: number): boolean =>
  Number.isInteger(val * 100);

export const WorkHoursSchema = z.object({
  hoursOfWork: z
    .number({ required_error: "Hours of work is required" })
    .superRefine((val, ctx) => {
      if (val < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hours of work cannot be negative",
        });
      } else if (val > 0 && val < 0.49) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: "number",
          minimum: 0.05,
          inclusive: true,
          message: "Hours of work must be at least 0.5",
        });
      }

      if (!validateTwoDecimals(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hours of work must have at most 2 decimal places",
        });
      }
    }),
});

export type WorkHoursForm = z.infer<typeof WorkHoursSchema>;

export const HoursOfWorkSchema = z.object({
  hoursOfWork: z.number(),
});

export type HoursOfWork = z.infer<typeof HoursOfWorkSchema>;
