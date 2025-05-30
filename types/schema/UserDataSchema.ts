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


export const GetUserDataSchema = z.object({
  userId: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  userType: UserTypeSchema.optional(),
});

export type GetUserData = z.infer<typeof GetUserDataSchema>;

export const CreateUserDataSchema = z.object({
  userId: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  userType: UserTypeSchema.optional(),
});

export type CreateUserData = z.infer<typeof CreateUserDataSchema>;

export const UpdateUserDataSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  userType: UserTypeSchema.optional(),
});

export type UpdateUserData = z.infer<typeof UpdateUserDataSchema>;