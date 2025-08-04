// connectors/EstimateConnector.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import type { EstimationExpiration } from "@/types/schema/EstimationExpirationSchema";
import { $fetch } from "ofetch";

export interface FetchOptions {
  headers?: Record<string, string>;
}

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const getEstimationExpirationUrl = (userId: string, questId: string) =>
  `${baseUrl}estimation/expiration/${encodeURIComponent(userId)}/${questId}`;

export async function fetchEstimationExpiration(
  userId: string,
  questId: string,
  opts?: FetchOptions
): Promise<EstimationExpiration> {
  return await $fetch(getEstimationExpirationUrl(userId, questId), {
    method: "GET",
    credentials: "include",
    headers: opts?.headers,
  });
}
