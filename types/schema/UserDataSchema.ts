import { z } from "zod";

// Zod schema
export const UserTypeSchema = z.enum(["Dev", "Client", "UnknownUserType"]);

export type UserType = z.infer<typeof UserTypeSchema>;

export const LoginUserDataSchema = z.object({
  email: z.string(),
  userType: UserTypeSchema.optional(),
});

export type LoginUserData = z.infer<typeof LoginUserDataSchema>;

export const RegistrationPayloadSchema = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  userType: UserTypeSchema,
});

export type RegistrationPayload = z.infer<typeof RegistrationPayloadSchema>;

export const GetUserDataSchema = z.object({
  userId: z.string(),
  email: z.string(),
  username: z.string(),
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
