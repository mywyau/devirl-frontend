import { z } from "zod";
import { SkillSchema } from "./SkillDataSchema";
import { LanguageSchema } from "./LangaugeSchema";

// Schema for individual skill data
export const ProfileSkillDataSchema = z.object({
  skill: SkillSchema,
  skillLevel: z.number(),
  skillXp: z.number(),
});
export type ProfileSkillData = z.infer<typeof ProfileSkillDataSchema>;

// Schema for individual language data
export const ProfileLanguageDataSchema = z.object({
  language: LanguageSchema,
  languageLevel: z.number(),
  languageXp: z.number(),
});
export type ProfileLanguageData = z.infer<typeof ProfileLanguageDataSchema>;

// Schema for the full profile, with arrays of skills/languages
export const ProfileDataSchema = z.object({
  devId: z.string(),
  username: z.string().nullable(), // or optional() if you allow it to be missing
  skillData: z.array(ProfileSkillDataSchema),
  languageData: z.array(ProfileLanguageDataSchema),
});
export type ProfileData = z.infer<typeof ProfileDataSchema>;
