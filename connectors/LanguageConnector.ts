// connectors/LanguageConnector.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch";

export interface FetchOptions {
  headers?: Record<string, string>;
}

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const getLanguageUrl = (devId: string, language: string) =>
  `${baseUrl}language/${language}/${encodeURIComponent(devId)}`;

const getHiscoreLanguageUrl = (language: string) =>
  `${baseUrl}hiscore/language/${language}`;

export async function fetchLanguage(
  devId: string,
  language: string,
  opts?: FetchOptions
): Promise<unknown> {
  return await $fetch(getLanguageUrl(devId, language), {
    credentials: "include",
    headers: opts?.headers,
  });
}

export async function fetchHiscoreLanguage(
  language: string,
  opts?: FetchOptions
): Promise<unknown> {
  return await $fetch(getHiscoreLanguageUrl(language), {
    method: "GET",
    credentials: "include",
    headers: opts?.headers,
  });
}
