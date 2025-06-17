// controllers/QuestBackendController.ts
import { z } from "zod";
import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch";


import {
  SkillDataSchema,
  type SkillData
} from "@/types/schema/SkillDataSchema";

export interface FetchOptions {
  headers?: Record<string, string>;
}

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const getSkillUrl = (devId: string, skill: string) =>
  `${baseUrl}skill/${skill}/${encodeURIComponent(devId)}`;

const getHiscoreSkillUrl = (skill: string) =>
  `${baseUrl}hiscore/skill/${skill}`;


export async function getSkill(
  devId: string,
  skill: string,
  opts?: FetchOptions
): Promise<SkillData> {
  const res = await $fetch(getSkillUrl(devId, skill), {
    credentials: "include",
    headers: opts?.headers,
  });

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
  const res = await $fetch(getHiscoreSkillUrl(skill), {
    credentials: "include",
    headers: opts?.headers,
  });

  const parsed = z.array(SkillDataSchema).safeParse(res);
  if (!parsed.success) {
    console.error("[getHiscoreSkill] Invalid skill data", parsed.error);
    throw new Error("Invalid skill data received from backend");
  }

  return parsed.data;
}

}
