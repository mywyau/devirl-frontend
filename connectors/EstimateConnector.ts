// connectors/EstimateConnector.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch";
import type { CreateEstimate } from "@/types/schema/EstimateSchema";

export interface FetchOptions {
  headers?: Record<string, string>;
}

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const getEstimatesUrl = (devId: string, questId: string) =>
  `${baseUrl}estimates/${encodeURIComponent(devId)}/${questId}`;

const createEstimateUrl = (devId: string) =>
  `${baseUrl}estimate/create/${encodeURIComponent(devId)}`;

export async function fetchEstimates(
  userId: string,
  questId: string,
  opts?: FetchOptions
): Promise<unknown> {
  return await $fetch(getEstimatesUrl(userId, questId), {
    method: "GET",
    credentials: "include",
    headers: opts?.headers,
  });
}

export async function postEstimate(
  userId: string,
  payload: CreateEstimate
): Promise<unknown> {
  return await $fetch(createEstimateUrl(userId), {
    method: "POST",
    credentials: "include",
    body: payload,
  });
}
