import { loadConfig } from "@/configuration/ConfigLoader";
import type {
  CreateQuestPayload,
  type QuestPartial,
} from "@/types/quests";


import { QuestStatusSchema } from "@/types/schema/QuestStatusSchema";
import { QuestPartialSchema } from "@/types/schema/QuestStatusSchema";


export class QuestBackendController {
  constructor(
    private readonly config = loadConfig(),
    private readonly apiBasePath = "/"
  ) {}

  private get baseUrl(): string {
    return `${this.config.devQuestBackend.baseUrl}${this.apiBasePath}`;
  }

  getAllQuestUrl(userId: string): string {
    return `${this.baseUrl}quest/stream/${encodeURIComponent(userId)}`;
  }

  getQuestUrl(userId: string, questId: string): string {
    return `${this.baseUrl}quest/${encodeURIComponent(userId)}/${questId}`;
  }

  deleteQuestUrl(userId: string, questId: string): string {
    console.log(
      "[QuestBackendController] deleteQuestUrl",
      `${this.baseUrl}quest/${encodeURIComponent(userId)}`
    );
    return `${this.baseUrl}quest/${encodeURIComponent(userId)}/${questId}`;
  }

  createQuestUrl(userId: string): string {
    console.log(
      "[QuestBackendController] createQuestUrl",
      `${this.baseUrl}quest/create/${encodeURIComponent(userId)}`
    );
    return `${this.baseUrl}quest/create/${encodeURIComponent(userId)}`;
  }

  updateQuestUrl(userId: string, questId: string): string {
    console.log(
      "[QuestBackendController] updateQuestUrl",
      `${this.baseUrl}quest/update/${encodeURIComponent(userId)}/${questId}`
    );
    return `${this.baseUrl}quest/update/${encodeURIComponent(
      userId
    )}/${questId}`;
  }

  async getQuest(userId: string, questId: string): Promise<QuestPartial> {
    const res = await fetch(this.getQuestUrl(userId, questId), {
      credentials: "include",
    });

    const json = await res.json();
    const result = QuestPartialSchema.safeParse(json);

    if (!result.success) {
      console.error("[getQuest] Invalid quest data", result.error);
      throw new Error("Invalid quest data received from backend");
    }

    return result.data;
  }

  /** Iterate over the ND-JSON stream coming from /quest/stream/… */
  // async *streamAllQuests(userId: string): AsyncGenerator<QuestPartial> {
  //   const res = await fetch(this.getAllQuestUrl(userId), {
  //     credentials: "include",
  //   });

  //   if (!res.ok || !res.body)
  //     throw new Error(
  //       `Streaming request failed: ${res.status} ${res.statusText}`
  //     );

  //   const reader = res.body.getReader();
  //   const decoder = new TextDecoder();
  //   let buffer = "";

  //   while (true) {
  //     const { done, value } = await reader.read();
  //     if (value) {
  //       buffer += decoder.decode(value, { stream: true });
  //       const lines = buffer.split("\n");
  //       buffer = lines.pop() || "";

  //       for (const l of lines) yield JSON.parse(l) as QuestPartial;
  //     }
  //     if (done) {
  //       if (buffer.trim() !== "") yield JSON.parse(buffer) as QuestPartial;
  //       return;
  //     }
  //   }
  // }

  async *streamAllQuestsNew(
    userId: string
  ): AsyncGenerator<QuestPartial, void, unknown> {
    const res = await fetch(this.getAllQuestUrl(userId), {
      credentials: "include",
    });

    if (!res.ok || !res.body) {
      throw new Error(
        `[streamAllQuestsNew] Failed to stream quests (status ${res.status})`
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
            yield JSON.parse(line) as QuestPartial;
          } catch (err) {
            console.error(
              "[streamAllQuestsNew] Failed to parse line:",
              line,
              err
            );
          }
        }
      }
    }

    if (buffer.trim()) {
      try {
        yield JSON.parse(buffer.trim()) as QuestPartial;
      } catch (err) {
        console.error(
          "[streamAllQuestsNew] Failed to parse final line:",
          buffer,
          err
        );
      }
    }
  }

  async createQuest(payload: CreateQuestPayload, userId: string) {
    try {
      const res = await fetch(this.createQuestUrl(userId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      // Check if the response is ok (status 200-299)
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      // Parse the response as JSON (assuming the server returns JSON)
      const data = await res.json();
      return data; // Return the response data, can be used for further processing
    } catch (error) {
      console.error("Request failed", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  }

  async updateQuest(
    userId: string,
    questId: string,
    payload: UpdateQuestPayload
  ) {
    try {
      const res = await fetch(this.updateQuestUrl(userId, questId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      // Check if the response is ok (status 200-299)
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      // Parse the response as JSON (assuming the server returns JSON)
      const data = await res.json();
      return data; // Return the response data, can be used for further processing
    } catch (error) {
      console.error("Request failed", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  }

  async deleteQuest(userId: string, questId: string): Promise<void> {
    const res = await fetch(this.deleteQuestUrl(userId, questId), {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`[deleteQuest] Failed with status ${res.status}`);
    }
  }
}
