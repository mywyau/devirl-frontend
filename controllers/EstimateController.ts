// controllers/QuestBackendController.ts
import { z } from "zod";
import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch";


import {
  CreateEstimateSchema,
  type CreateEstimate
} from "@/types/schema/EstimateSchema";

export interface FetchOptions {
  headers?: Record<string, string>;
}

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const createEstimateUrl = (devId: string) =>
  `${baseUrl}estimate/create/${encodeURIComponent(devId)}`;


export async function createEstimate(userId: string, payload: CreateEstimate) {
  return await $fetch(createEstimateUrl(userId), {
    method: "POST",
    credentials: "include",
    body: payload,
  });
}