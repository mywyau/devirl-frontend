import { loadConfig } from "@/configuration/ConfigLoader";
import type { CreateQuestPayload, QuestPartial } from "@/types/quests";
import { useFetch } from "nuxt/app";

export class QuestBackendController {
  constructor(
    private readonly config = loadConfig(),
    private readonly apiBasePath = "/dev-quest-service"
  ) {}

  private get baseUrl(): string {
    return `${this.config.devQuestBackend.baseUrl}${this.apiBasePath}`;
  }

  getQuestUrl(questId: string): string {
    return `${this.baseUrl}/quest/${questId}`;
  }

  createQuestUrl(userId: string): string {
    return `${this.baseUrl}/quest/create/${userId}`;
  }

  async getQuest(questId: string): Promise<QuestPartial | null> {
    const { data, error } = await useFetch<QuestPartial>(
      this.getQuestUrl(questId),
      {
        credentials: "include",
      }
    );

    if (error.value) throw error.value;
    return data.value;
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
