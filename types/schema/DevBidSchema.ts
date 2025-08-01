// types/AddRewardForm.ts
import { z } from "zod";

const validateTwoDecimals = (val: number): boolean =>
  Number.isInteger(val * 100);

export const DevBidSchema = z.object({
  bid: z
    .number({ required_error: "Bid is required" })
    .superRefine((val, ctx) => {
      if (val < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bid cannot be negative",
        });
      } else if (val > 0 && val < 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          type: "number",
          minimum: 0.05,
          inclusive: true,
          message: "Bid must be at least 0.01",
        });
      }

      if (!validateTwoDecimals(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bid must have at most 2 decimal places",
        });
      }
    }),
});

export type DevBid = z.infer<typeof DevBidSchema>;

export const GetDevBidSchema = z.object({
  devUsername: z.string(),
  bid: z.number(),
});

export type GetDevBid = z.infer<typeof GetDevBidSchema>;
