// types/UserRegistration.ts
import { z } from "zod";

const pluralize = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;

const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
const nameRegex = /^[a-zA-Z]+(?:[-' ][a-zA-Z]+)*$/;

export const userRegistrationSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(20, { message: `Max ${pluralize(20, "character")}` })
    .regex(
      usernameRegex,
      "Username must start with a letter and contain only letters, numbers, and underscores"
    ),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, { message: `Max ${pluralize(50, "character")}` })
    .regex(
      nameRegex,
      "First name must only contain letters, hyphens, or apostrophes"
    ),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, { message: `Max ${pluralize(50, "character")}` })
    .regex(
      nameRegex,
      "Last name must only contain letters, hyphens, or apostrophes"
    ),
  userType: z.enum(["Client", "Dev"], {
    required_error: "User type is required",
  }),
});

export type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;
