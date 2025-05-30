// controllers/QuestBackendController.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import type { CreateQuestPayload } from "@/types/quests";
import {
  QuestPartialSchema,
  type QuestStatus,
} from "@/types/schema/QuestStatusSchema";
import { $fetch } from "ofetch";

export interface UpdateQuestPayload {
  title?: string;
  status?: string;
}

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const getQuestUrl = (userId: string, questId: string) =>
  `${baseUrl}quest/${encodeURIComponent(userId)}/${questId}`;

const createQuestUrl = (userId: string) =>
  `${baseUrl}quest/create/${encodeURIComponent(userId)}`;

const updateQuestUrl = (userId: string, questId: string) =>
  `${baseUrl}quest/update/${encodeURIComponent(userId)}/${questId}`;

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
  `${baseUrl}quest/stream/new/${encodeURIComponent(userId)}` +
  `?status=${questStatus.toString()}` +
  `&page=${page}` +
  `&limit=${limit}`;

// export function streamQuestByStatusUrl(
//   userId: string,
//   status: QuestStatus,
//   page = 1,
//   limit = 10
// ) {
//   // 1) Remove any leading/trailing quotes that snuck into the ID
//   const cleanId = userId.replace(/^"+|"+$/g, "");

//   // 2) Ensure baseUrl has no trailing slash, then add your path
//   const root = baseUrl.replace(/\/$/, "");
//   const endpoint = `/quest/stream/new/${encodeURIComponent(cleanId)}`;

//   // 3) Build full URL
//   const url = new URL(root + endpoint);
//   url.searchParams.set("status", status);
//   url.searchParams.set("page", String(page));
//   url.searchParams.set("limit", String(limit));

//   console.log("[streamAllQuests] →", url.toString());
//   return url.toString();
// }

export async function getQuest(userId: string, questId: string) {
  const res = await $fetch(getQuestUrl(userId, questId), {
    credentials: "include",
  });

  const result = QuestPartialSchema.safeParse(res);

  if (!result.success) {
    console.error("[getQuest] Invalid quest data", result.error);
    throw new Error("Invalid quest data received from backend");
  }

  return result.data;
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

export async function deleteQuest(userId: string, questId: string) {
  return await $fetch(deleteQuestUrl(userId, questId), {
    method: "DELETE",
    credentials: "include",
  });
}

export async function* streamAllQuestsForUser(userId: string) {
  const res = await fetch(getAllQuestUrlForUser(userId), {
    credentials: "include",
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

// Stream quests filtered by status
export async function* streamAllQuestsByStatus(
  userId: string,
  questStatus: QuestStatus,
  page = 1,
  limit = 10
) {
  const url = streamQuestByStatusUrl(userId, questStatus, page, limit);
  console.debug("[streamAllQuestsByStatus] URL →", url);

  const res = await fetch(url, {
    credentials: "include",
    headers: { "Accept": "application/x-ndjson" },
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
          console.error("[streamAllQuestsByStatus] Failed to parse line:", line, err);
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
