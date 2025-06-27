// controllers/EstimateController.ts
import {
  fetchEstimates,
  postEstimate,
  type FetchOptions,
} from "@/connectors/EstimateConnector";

import {
  GetEstimateSchema,
  type CreateEstimate,
  type GetEstimate,
} from "@/types/schema/EstimateSchema";

import z from "zod";

export async function getEstimatesRequest(
  userId: string,
  questId: string,
  opts?: FetchOptions
): Promise<GetEstimate[]> {
  const res = await fetchEstimates(userId, questId, opts);

  const parsed = z.array(GetEstimateSchema).safeParse(res);
  if (!parsed.success) {
    console.error("[getEstimatesRequest] Invalid estimate data", parsed.error);
    throw new Error("Invalid estimate data received from backend");
  }
  return parsed.data;
}

export async function createEstimate(
  userId: string,
  payload: CreateEstimate
): Promise<unknown> {
  return await postEstimate(userId, payload);
}
