// controllers/LanguageController.ts
import {
  fetchHiscoreLanguage,
  fetchLanguage,
  type FetchOptions,
} from "@/connectors/LanguageConnector";
import { z } from "zod";

import {
  LanguageDataSchema,
  type LanguageData,
} from "@/types/schema/LangaugeSchema";

export async function getLanguage(
  devId: string,
  language: string,
  opts?: FetchOptions
): Promise<LanguageData> {
  const res = await fetchLanguage(devId, language, opts);

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
  const res = await fetchHiscoreLanguage(language, opts);

  const parsed = z.array(LanguageDataSchema).safeParse(res);
  if (!parsed.success) {
    console.error("[getHiscoreLanguage] Invalid language data", parsed.error);
    throw new Error("Invalid language data received from backend");
  }

  return parsed.data;
}
