// controllers/QuestBackendController.ts
import { z } from "zod";
import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch";


import {
  LanguageDataSchema,
  type LanguageData
} from "@/types/schema/LangaugeSchema";

export interface FetchOptions {
  headers?: Record<string, string>;
}

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const getLanguageUrl = (devId: string, language: string) =>
  `${baseUrl}language/${language}/${encodeURIComponent(devId)}`;

const getHiscoreLanguageUrl = (language: string) =>
  `${baseUrl}hiscore/language/${language}`;


export async function getLanguage(
  devId: string,
  language: string,
  opts?: FetchOptions
): Promise<LanguageData> {
  const res = await $fetch(getLanguageUrl(devId, language), {
    credentials: "include",
    headers: opts?.headers,
  });

  const parsed = LanguageDataSchema.safeParse(res);
  if (!parsed.success) {
    console.error("[getLanguage] Invalid language data", parsed.error);
    throw new Error("Invalid language data received from backend");
  }
  return parsed.data;
}

export async function getHiscoreLanguage(
  language: string,
  opts?: FetchOptions
): Promise<LanguageData[]> {
  const res = await $fetch(getHiscoreLanguageUrl(language), {
    method: "GET",
    credentials: "include",
    headers: opts?.headers,
  });

  const parsed = z.array(LanguageDataSchema).safeParse(res);
  if (!parsed.success) {
    console.error("[getHiscoreLanguage] Invalid language data", parsed.error);
    throw new Error("Invalid language data received from backend");
  }

  return parsed.data;
}
