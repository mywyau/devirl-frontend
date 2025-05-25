import { z } from "zod";

// Zod schema
export const UserTypeSchema = z.enum(["Dev", "Client", "UnknownUserType"]);

export type UserType = z.infer<typeof UserTypeSchema>;

export const UserDataSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  userType: UserTypeSchema.optional(),
});

export type UserData = z.infer<typeof UserDataSchema>;

export const UpdateUserTypeSchema = z.object({
  userType: UserTypeSchema,
});

export type UpdateUserType = z.infer<typeof UpdateUserTypeSchema>;
