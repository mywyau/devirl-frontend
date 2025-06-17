import { z } from "zod";

export const SkillSchema = z.enum(["Questing", "Reviewing", "Testing"]);

export type Skill = z.infer<typeof SkillSchema>;

export const SkillDataSchema = z.object({
  devId: z.string(),
  username: z.string(),
  skill: SkillSchema,
  level: z.number(),
  xp: z.number(),
});

export type SkillData = z.infer<typeof SkillDataSchema>;
