// controllers/QuestBackendController.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch";

import {
  GetEstimateSchema,
  type CreateEstimate,
  type GetEstimate,
} from "@/types/schema/EstimateSchema";
import z from "zod";

export interface FetchOptions {
  headers?: Record<string, string>;
}

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const getEstimatesUrl = (devId: string, questId: string) =>
  `${baseUrl}estimates/${encodeURIComponent(devId)}/${questId}`;

const createEstimateUrl = (devId: string) =>
  `${baseUrl}estimate/create/${encodeURIComponent(devId)}`;

export async function getEstimatesRequest(
  userId: string,
  questId: string,
  opts?: FetchOptions
): Promise<GetEstimate[]> {
  const res = await $fetch(getEstimatesUrl(userId, questId), {
    method: "GET",
    credentials: "include",
    headers: opts?.headers,
  });

  const parsed = z.array(GetEstimateSchema).safeParse(res);
  if (!parsed.success) {
    console.error("[getEstimatesRequest] Invalid estimate data", parsed.error);
    throw new Error("Invalid estimate data received from backend");
  }
  return parsed.data;
}

export async function createEstimate(userId: string, payload: CreateEstimate) {
  return await $fetch(createEstimateUrl(userId), {
    method: "POST",
    credentials: "include",
    body: payload,
  });
}
