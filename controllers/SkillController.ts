// controllers/SkillController.ts
import {
  fetchHiscoreSkill,
  fetchSkill,
  type FetchOptions,
} from "@/connectors/SkillConnector";
import {
  SkillDataSchema,
  type SkillData,
} from "@/types/schema/SkillDataSchema";
import { z } from "zod";

export async function getSkill(
  devId: string,
  skill: string,
  opts?: FetchOptions
): Promise<SkillData> {
  const res = await fetchSkill(devId, skill, opts);

  const parsed = SkillDataSchema.safeParse(res);
  if (!parsed.success) {
    console.error("[getSkill] Invalid skill data", parsed.error);
    throw new Error("Invalid skill data received from backend");
  }

  return parsed.data;
}

export async function getHiscoreSkill(
  skill: string,
  opts?: FetchOptions
): Promise<SkillData[]> {
  const res = await fetchHiscoreSkill(skill, opts);

  const parsed = z.array(SkillDataSchema).safeParse(res);
  if (!parsed.success) {
    console.error("[getHiscoreSkill] Invalid skill data", parsed.error);
    throw new Error("Invalid skill data received from backend");
  }

  return parsed.data;
}
