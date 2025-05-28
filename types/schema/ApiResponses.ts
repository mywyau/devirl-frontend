import { z } from "zod";

export const CreatedResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type CreatedResponse = z.infer<typeof CreatedResponseSchema>;

export const DeleteResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;


export const GetResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type GetResponse = z.infer<typeof GetResponseSchema>;

export const UpdateResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export type UpdateResponse = z.infer<typeof UpdateResponseSchema>;

