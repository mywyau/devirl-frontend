import { z } from "zod";

export const LanguageSchema = z.enum([
  "C",
  "C++",
  "C#",
  "Go",
  "Java",
  "JavaScript",
  "Kotlin",
  "PHP",
  "Python",
  "Ruby",
  "Rust",
  "Scala",
  "Sql",
  "Swift",
  "TypeScript",
]);

export type Language = z.infer<typeof LanguageSchema>;

export const LanguageDataSchema = z.object({
  devId: z.string(),
  username: z.string(),
  language: LanguageSchema,
  level: z.number(),
  xp: z.number(),
});

export type LanguageData = z.infer<typeof LanguageDataSchema>;
