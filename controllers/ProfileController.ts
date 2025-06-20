// controllers/QuestBackendController.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch";

import {
  ProfileDataSchema,
  type ProfileData,
} from "@/types/schema/ProfileDataSchema";
import z from "zod";

export interface FetchOptions {
  headers?: Record<string, string>;
}

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const getProfileSkillDataUrl = (devId: string) =>
  `${baseUrl}profile/skill/language/data/${encodeURIComponent(devId)}`;

export async function getAllProfileSkillData(
  devId: string,
  opts?: FetchOptions
): Promise<ProfileData[]> {
  const res = await $fetch(getProfileSkillDataUrl(devId), {
    credentials: "include",
    headers: opts?.headers,
  });

  const parsed = z.array(ProfileDataSchema).safeParse(res);
  if (!parsed.success) {
    console.error("[getSkill] Invalid skill data", parsed.error);
    throw new Error("Invalid skill data received from backend");
  }
  return parsed.data;
}
