import { z } from "zod";

export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  column: z.string().optional(),
});

export const ErrorsResponseSchema = z.array(ErrorResponseSchema);
