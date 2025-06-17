import { z } from "zod";

export const LanguageSchema = z.enum(["Python", "Java", "Scala", "Rust", "Typescript"]);

export type Language = z.infer<typeof LanguageSchema>;

export const LanguageDataSchema = z.object({
  devId: z.string(),
  username: z.string(),
  language: LanguageSchema,
  level: z.number(),
  xp: z.number(),
});

export type LanguageData = z.infer<typeof LanguageDataSchema>;
