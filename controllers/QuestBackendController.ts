// controllers/QuestBackendController.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import type { CreateQuestPayload } from "@/types/quests";
import {
  QuestPartialSchema,
  type QuestPartial,
  type QuestStatus,
  type UpdateQuestStatus
} from "@/types/schema/QuestStatusSchema";
import { $fetch } from "ofetch";

export interface UpdateQuestPayload {
  rank: string;
  title: string;
  description?: string;
  acceptanceCriteria: string;
}

export interface AcceptQuestPayload {
  devId: string;
  questId: string;
}

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const getQuestUrl = (userId: string, questId: string) =>
  `${baseUrl}quest/${encodeURIComponent(userId)}/${questId}`;

const createQuestUrl = (userId: string) =>
  `${baseUrl}quest/create/${encodeURIComponent(userId)}`;

const updateQuestUrl = (userId: string, questId: string) =>
  `${baseUrl}quest/update/details/${encodeURIComponent(userId)}/${questId}`;

const updateQuestStatusUrl = (userId: string, questId: string) =>
  `${baseUrl}quest/update/status/${encodeURIComponent(userId)}/${questId}`;

const acceptQuestUrl = (userId: string) =>
  `${baseUrl}quest/accept/quest/${encodeURIComponent(userId)}`;

const deleteQuestUrl = (userId: string, questId: string) =>
  `${baseUrl}quest/${encodeURIComponent(userId)}/${questId}`;

const getAllQuestUrlForUser = (userId: string) =>
  `${baseUrl}quest/stream/${encodeURIComponent(userId)}`;

const streamAllQuestUrl = (userId: string) =>
  `${baseUrl}quest/stream/all/${encodeURIComponent(userId)}`;

const streamQuestByStatusUrl = (
  userId: string,
  questStatus: QuestStatus,
  page = 1,
  limit = 10
) =>
  `${baseUrl}quest/stream/client/new/${encodeURIComponent(userId)}` +
  `?status=${questStatus.toString()}` +
  `&page=${page}` +
  `&limit=${limit}`;

const streamQuestByStatusDevUrl = (
  devId: string,
  questStatus: QuestStatus,
  page = 1,
  limit = 10
) =>
  `${baseUrl}quest/stream/dev/new/${encodeURIComponent(devId)}` +
  `?status=${questStatus.toString()}` +
  `&page=${page}` +
  `&limit=${limit}`;

export interface FetchOptions {
  headers?: Record<string, string>;
}

export async function getQuest(
  userId: string,
  questId: string,
  opts?: FetchOptions
): Promise<QuestPartial> {
  const res = await $fetch(getQuestUrl(userId, questId), {
    credentials: "include",
    headers: opts?.headers,
  });

  const parsed = QuestPartialSchema.safeParse(res);
  if (!parsed.success) {
    console.error("[getQuest] Invalid quest data", parsed.error);
    throw new Error("Invalid quest data received from backend");
  }
  return parsed.data;
}

export async function createQuest(userId: string, payload: CreateQuestPayload) {
  return await $fetch(createQuestUrl(userId), {
    method: "POST",
    credentials: "include",
    body: payload,
  });
}

export async function updateQuest(
  userId: string,
  questId: string,
  payload: UpdateQuestPayload
) {
  return await $fetch(updateQuestUrl(userId, questId), {
    method: "PUT",
    credentials: "include",
    body: payload,
  });
}

export async function updateQuestStatusRequest(
  userId: string,
  questId: string,
  payload: UpdateQuestStatus
) {
  return await $fetch(updateQuestStatusUrl(userId, questId), {
    method: "PUT",
    credentials: "include",
    body: payload,
  });
}

export async function acceptQuestRequest(
  userId: string,
  payload: AcceptQuestPayload
) {
  return await $fetch(acceptQuestUrl(userId), {
    method: "PUT",
    credentials: "include",
    body: payload,
  });
}

export async function deleteQuest(userId: string, questId: string) {
  return await $fetch(deleteQuestUrl(userId, questId), {
    method: "DELETE",
    credentials: "include",
  });
}

export async function* streamAllQuestsForUser(
  userId: string,
  opts?: FetchOptions
) {
  const res = await fetch(getAllQuestUrlForUser(userId), {
    credentials: "include",
    headers: opts?.headers,
  });

  if (!res.ok || !res.body) {
    throw new Error(
      `[streamAllQuestsForUser] Failed with status ${res.status}`
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex;
    while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (line) {
        try {
          yield JSON.parse(line);
        } catch (err) {
          console.error("[streamAllQuests] Failed to parse line:", line, err);
        }
      }
    }
  }

  if (buffer.trim()) {
    try {
      yield JSON.parse(buffer.trim());
    } catch (err) {
      console.error(
        "[streamAllQuests] Failed to parse final line:",
        buffer,
        err
      );
    }
  }
}

export async function* streamAllQuests(userId: string) {
  const res = await fetch(streamAllQuestUrl(userId), {
    credentials: "include",
  });

  if (!res.ok || !res.body) {
    throw new Error(`[streamAllQuests] Failed with status ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex;
    while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (line) {
        try {
          yield JSON.parse(line);
        } catch (err) {
          console.error("[streamAllQuests] Failed to parse line:", line, err);
        }
      }
    }
  }

  if (buffer.trim()) {
    try {
      yield JSON.parse(buffer.trim());
    } catch (err) {
      console.error(
        "[streamAllQuests] Failed to parse final line:",
        buffer,
        err
      );
    }
  }
}

// Stream quests filtered by status clientId
export async function* streamAllQuestsByStatus(
  clientId: string,
  questStatus: QuestStatus,
  page = 1,
  limit = 10
) {
  const url = streamQuestByStatusUrl(clientId, questStatus, page, limit);
  console.debug("[streamAllQuestsByStatus] URL →", url);

  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/x-ndjson" },
  });

  if (!res.ok || !res.body) {
    throw new Error(
      `[streamAllQuestsByStatus] Failed with status ${res.status}`
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex;
    while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (line) {
        try {
          yield JSON.parse(line);
        } catch (err) {
          console.error(
            "[streamAllQuestsByStatus] Failed to parse line:",
            line,
            err
          );
        }
      }
    }
  }

  // Parse any remaining buffer
  const leftover = buffer.trim();
  if (leftover) {
    try {
      yield JSON.parse(leftover);
    } catch (err) {
      console.error(
        "[streamAllQuestsByStatus] Failed to parse leftover buffer:",
        leftover,
        err
      );
    }
  }
}

// Stream quests filtered by status for devId
export async function* streamAllQuestsByStatusDev(
  devId: string,
  questStatus: QuestStatus,
  page = 1,
  limit = 10
) {
  const url = streamQuestByStatusDevUrl(devId, questStatus, page, limit);
  console.debug("[streamAllQuestsByStatus] URL →", url);

  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/x-ndjson" },
  });

  if (!res.ok || !res.body) {
    throw new Error(
      `[streamAllQuestsByStatus] Failed with status ${res.status}`
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let newlineIndex;
    while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (line) {
        try {
          yield JSON.parse(line);
        } catch (err) {
          console.error(
            "[streamAllQuestsByStatus] Failed to parse line:",
            line,
            err
          );
        }
      }
    }
  }

  // Parse any remaining buffer
  const leftover = buffer.trim();
  if (leftover) {
    try {
      yield JSON.parse(leftover);
    } catch (err) {
      console.error(
        "[streamAllQuestsByStatus] Failed to parse leftover buffer:",
        leftover,
        err
      );
    }
  }
}
