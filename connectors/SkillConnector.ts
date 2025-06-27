// connectors/SkillConnector.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch";

export interface FetchOptions {
  headers?: Record<string, string>;
}

const config = loadConfig();
const baseUrl = config.devQuestBackend.baseUrl.replace(/\/$/, ""); // normalize

const getSkillUrl = (devId: string, skill: string) =>
  `${baseUrl}/skill/${skill}/${encodeURIComponent(devId)}`;

const getHiscoreSkillUrl = (skill: string) =>
  `${baseUrl}/hiscore/skill/${skill}`;

export async function fetchSkill(
  devId: string,
  skill: string,
  opts?: FetchOptions
): Promise<unknown> {
  return await $fetch(getSkillUrl(devId, skill), {
    credentials: "include",
    headers: opts?.headers,
  });
}

export async function fetchHiscoreSkill(
  skill: string,
  opts?: FetchOptions
): Promise<unknown> {
  return await $fetch(getHiscoreSkillUrl(skill), {
    method: "GET",
    credentials: "include",
    headers: opts?.headers,
  });
}
