// types/UserRegistration.ts
import { z } from "zod";

const pluralize = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;

const usernameRegex = /^[a-z][a-z0-9_]*$/;
const nameRegex = /^[a-z]+(?:[-' ][a-z]+)*$/;

export const userRegistrationSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(20, { message: `Max ${pluralize(20, "character")}` })
    .regex(
      usernameRegex,
      "Usernames must be lowercase and only contain letters, numbers, and underscores"
    ),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, { message: `Max ${pluralize(50, "character")}` })
    .superRefine((val, ctx) => {
      if (val.length > 0 && !nameRegex.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "First name must be lowercase and only contain letters, hyphens, or apostrophes",
        });
      }
    }),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, { message: `Max ${pluralize(50, "character")}` })
    .superRefine((val, ctx) => {
      if (val.length > 0 && !nameRegex.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Last name must be lowercase and only contain letters, hyphens, or apostrophes",
        });
      }
    }),
});

export type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;
