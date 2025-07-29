// controllers/QuestController.ts
import type { FetchOptions } from "@/types/FetchOptions";
import type {
  AcceptQuestPayload,
  UpdateQuestPayload,
} from "@/types/quest/CreateQuestPayload";
import type {
  CompleteQuestPayload,
  CreateQuestSchema,
  QuestPartial,
  QuestStatus,
  UpdateQuestSchema,
  UpdateQuestStatus,
} from "@/types/schema/QuestStatusSchema";
import { QuestPartialSchema } from "@/types/schema/QuestStatusSchema";

import {
  acceptQuestRequest,
  completeQuestRequest,
  createQuestRequest,
  deleteQuestRequest,
  fetchNDJSONStreamRequest,
  getQuestRequest,
  updateQuestRequest,
  updateQuestStatusRequest,
  url,
} from "@/connectors/QuestConnector";

export async function getQuest(
  userId: string,
  questId: string,
  opts?: FetchOptions
): Promise<QuestPartial> {
  const res = await getQuestRequest(userId, questId, opts);
  const parsed = QuestPartialSchema.safeParse(res);
  if (!parsed.success) {
    console.error("[getQuest] Invalid quest data", parsed.error);
    throw new Error("Invalid quest data received from backend");
  }
  return parsed.data;
}

export const createQuest = (userId: string, payload: CreateQuestSchema) =>
  createQuestRequest(userId, payload);

export const updateQuest = (
  userId: string,
  questId: string,
  payload: UpdateQuestSchema
) => updateQuestRequest(userId, questId, payload);

export const completeQuest = (
  userId: string,
  questId: string,
  payload: CompleteQuestPayload
) => completeQuestRequest(userId, questId, payload);

export const updateQuestStatus = (
  userId: string,
  questId: string,
  payload: UpdateQuestStatus
) => updateQuestStatusRequest(userId, questId, payload);

export const acceptQuest = (userId: string, payload: AcceptQuestPayload) =>
  acceptQuestRequest(userId, payload);

export const deleteQuest = (userId: string, questId: string) =>
  deleteQuestRequest(userId, questId);

export async function* streamQuests(url: string, opts?: FetchOptions) {
  const res = await fetchNDJSONStreamRequest(url, opts);
  if (!res.ok || !res.body)
    throw new Error(`[streamQuests] Failed: ${res.status}`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (line) yield JSON.parse(line);
    }
  }

  if (buffer.trim()) yield JSON.parse(buffer.trim());
}

export const streamAllQuestsForUser = (userId: string, opts?: FetchOptions) =>
  streamQuests(url.streamAllForUser(userId), opts);

export const streamAllQuests = (userId: string) =>
  streamQuests(url.streamAll(userId));

export const streamAllQuestsReward = (userId: string, page: number, limit: number) =>
  streamQuests(url.streamRewarded(userId, page, limit));

export const streamAllQuestsByStatus = (
  clientId: string,
  status: QuestStatus,
  page = 1,
  limit = 10
) => streamQuests(url.streamByStatus(clientId, status, page, limit));

export const streamAllQuestsByStatusDev = (
  devId: string,
  status: QuestStatus,
  page = 1,
  limit = 10
) => streamQuests(url.streamByStatusDev(devId, status, page, limit));
