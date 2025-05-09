import { loadConfig } from "@/configuration/ConfigLoader";
import type { CreateQuestPayload, QuestPartial } from "@/types/quests";

export class QuestBackendController {
  constructor(
    private readonly config = loadConfig(),
    private readonly apiBasePath = "/dev-quest-service"
  ) {}

  private get baseUrl(): string {
    return `${this.config.devQuestBackend.baseUrl}${this.apiBasePath}`;
  }

  getAllQuestUrl(userId: string): string {
    return `${this.baseUrl}/quest/stream/${encodeURIComponent(userId)}`;
  }

  getQuestUrl(questId: string): string {
    return `${this.baseUrl}/quest/${questId}`;
  }

  createQuestUrl(userId: string): string {
    return `${this.baseUrl}/quest/create/${userId}`;
  }

  async getQuest(questId: string): Promise<Response> {
    return await fetch(this.getQuestUrl(questId), {
      credentials: "include",
    });
  }

  /** Iterate over the ND-JSON stream coming from /quest/stream/… */
  async *streamAllQuests(userId: string): AsyncGenerator<QuestPartial> {
    const res = await fetch(this.getAllQuestUrl(userId), {
      credentials: "include",
    });

    if (!res.ok || !res.body)
      throw new Error(
        `Streaming request failed: ${res.status} ${res.statusText}`
      );

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const l of lines) yield JSON.parse(l) as QuestPartial;
      }
      if (done) {
        if (buffer.trim() !== "") yield JSON.parse(buffer) as QuestPartial;
        return;
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
}
