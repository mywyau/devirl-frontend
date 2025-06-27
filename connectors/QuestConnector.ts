// connectors/QuestConnector.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import type { FetchOptions } from "@/types/FetchOptions";
import type { AcceptQuestPayload } from "@/types/quest/AcceptQuestPayload";
import type { CreateQuestPayload } from "@/types/quest/CreateQuestPayload";
import type { UpdateQuestPayload } from "@/types/quest/UpdateQuestPayload";
import type {
  CompleteQuestPayload,
  CreateQuestSchema,
  QuestStatus,
  UpdateQuestStatus,
} from "@/types/schema/QuestStatusSchema";
import { $fetch } from "ofetch";


const config = loadConfig();
const baseUrl = config.devQuestBackend.baseUrl.replace(/\/$/, "");

export const url = {
  getQuest: (userId: string, questId: string) =>
    `${baseUrl}/quest/${encodeURIComponent(userId)}/${questId}`,
  createQuest: (userId: string) =>
    `${baseUrl}/quest/create/${encodeURIComponent(userId)}`,
  updateQuest: (userId: string, questId: string) =>
    `${baseUrl}/quest/update/details/${encodeURIComponent(userId)}/${questId}`,
  updateStatus: (userId: string, questId: string) =>
    `${baseUrl}/quest/update/status/${encodeURIComponent(userId)}/${questId}`,
  completeQuest: (userId: string, questId: string) =>
    `${baseUrl}/quest/update/complete/award/xp/${encodeURIComponent(
      userId
    )}/${questId}`,
  acceptQuest: (userId: string) =>
    `${baseUrl}/quest/accept/quest/${encodeURIComponent(userId)}`,
  deleteQuest: (userId: string, questId: string) =>
    `${baseUrl}/quest/${encodeURIComponent(userId)}/${questId}`,
  streamAllForUser: (userId: string) =>
    `${baseUrl}/quest/stream/${encodeURIComponent(userId)}`,
  streamAll: (userId: string) =>
    `${baseUrl}/quest/stream/all/${encodeURIComponent(userId)}`,
  streamRewarded: (userId: string) =>
    `${baseUrl}/quest/reward/stream/${encodeURIComponent(userId)}`,
  streamByStatus: (userId: string, status: QuestStatus, page = 1, limit = 10) =>
    `${baseUrl}/quest/stream/client/new/${encodeURIComponent(
      userId
    )}?status=${status}&page=${page}&limit=${limit}`,
  streamByStatusDev: (
    devId: string,
    status: QuestStatus,
    page = 1,
    limit = 10
  ) =>
    `${baseUrl}/quest/stream/dev/new/${encodeURIComponent(
      devId
    )}?status=${status}&page=${page}&limit=${limit}`,
};

export async function getQuestRequest(
  userId: string,
  questId: string,
  opts?: FetchOptions
) {
  return $fetch(url.getQuest(userId, questId), {
    method: "GET",
    credentials: "include",
    headers: opts?.headers,
  });
}

export async function createQuestRequest(
  userId: string,
  body: CreateQuestSchema
) {
  return $fetch(url.createQuest(userId), {
    method: "POST",
    credentials: "include",
    body,
  });
}

export async function updateQuestRequest(
  userId: string,
  questId: string,
  body: UpdateQuestPayload
) {
  return $fetch(url.updateQuest(userId, questId), {
    method: "PUT",
    credentials: "include",
    body,
  });
}

export async function completeQuestRequest(
  userId: string,
  questId: string,
  body: CompleteQuestPayload
) {
  return $fetch(url.completeQuest(userId, questId), {
    method: "PUT",
    credentials: "include",
    body,
  });
}

export async function updateQuestStatusRequest(
  userId: string,
  questId: string,
  body: UpdateQuestStatus
) {
  return $fetch(url.updateStatus(userId, questId), {
    method: "PUT",
    credentials: "include",
    body,
  });
}

export async function acceptQuestRequest(
  userId: string,
  body: AcceptQuestPayload
) {
  return $fetch(url.acceptQuest(userId), {
    method: "PUT",
    credentials: "include",
    body,
  });
}

export async function deleteQuestRequest(userId: string, questId: string) {
  return $fetch(url.deleteQuest(userId, questId), {
    method: "DELETE",
    credentials: "include",
  });
}

export async function fetchNDJSONStreamRequest(
  url: string,
  opts?: FetchOptions
): Promise<Response> {
  return fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/x-ndjson",
      ...opts?.headers,
    },
  });
}