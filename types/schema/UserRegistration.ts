// types/UserRegistration.ts
import { z } from "zod";

const pluralize = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;

export const userRegistrationSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(20, { message: `Max ${pluralize(20, "character")}` })
    .superRefine((val, ctx) => {
      // 1. Must start with a lowercase letter
      if (!/^[a-z]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Username must start with a lowercase letter",
        });
      }
      // 2. Must contain only lowercase letters, numbers, and underscores
      if (!/^[a-z][a-z0-9_]*$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Username can only contain lowercase letters, numbers, and underscores",
        });
      }
    }),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, { message: `Max ${pluralize(50, "character")}` })
    .superRefine((val, ctx) => {
      if (!/^[a-z]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "First name must start with a lowercase letter",
        });
      }

      if (!/^[a-z]+(?:[-' ][a-z]+)*$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "First name may contain only lowercase letters, hyphens, apostrophes, or spaces",
        });
      }
    }),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, { message: `Max ${pluralize(50, "character")}` })
    .superRefine((val, ctx) => {
      if (!/^[a-z]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Last name must start with a lowercase letter",
        });
      }

      if (!/^[a-z]+(?:[-' ][a-z]+)*$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Last name may contain only lowercase letters, hyphens, apostrophes, or spaces",
        });
      }
    }),
  userType: z
    .string()
    .min(1, "Please select a role")
    .refine((val) => val === "Client" || val === "Dev", {
      message: "Invalid role selection",
    }),
});

export type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;
