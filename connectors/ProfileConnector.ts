// connectors/ProfileConnector.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch";

export interface FetchOptions {
  headers?: Record<string, string>;
}

const config = loadConfig();
const baseUrl = config.devQuestBackend.baseUrl.replace(/\/$/, "");

const getProfileSkillDataUrl = (devId: string) =>
  `${baseUrl}/profile/skill/language/data/${encodeURIComponent(devId)}`;

export async function fetchAllProfileSkillData(
  devId: string,
  opts?: FetchOptions
): Promise<unknown> {
  return await $fetch(getProfileSkillDataUrl(devId), {
    credentials: "include",
    headers: opts?.headers,
  });
}
