import { QuestBackendController } from "@/controllers/QuestBackendController";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock loadConfig to return predictable URLs
vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: { baseUrl: "https://api.devirl.com" },
  }),
}));

describe("QuestBackendController", () => {
  let controller: QuestBackendController;

  beforeEach(() => {
    controller = new QuestBackendController();
    vi.restoreAllMocks();
  });

  it("generates correct quest URLs", () => {
    expect(controller.getAllQuestUrl("user123")).toBe(
      "https://api.devirl.com/dev-quest-service/quest/stream/user123"
    );
    expect(controller.getQuestUrl("quest456")).toBe(
      "https://api.devirl.com/dev-quest-service/quest/quest456"
    );
    expect(controller.createQuestUrl("user123")).toBe(
      "https://api.devirl.com/dev-quest-service/quest/create/user123"
    );
  });

  it("calls fetch with correct URL in getQuest()", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ id: "quest456" }),
    }) as any;

    const result = await controller.getQuest("quest456");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.devirl.com/dev-quest-service/quest/quest456",
      {
        credentials: "include",
      }
    );
    expect(result.ok).toBe(true);
  });

  it("successfully creates a quest", async () => {
    const mockResponse = { id: 123, title: "Test Quest" };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    }) as any;

    const result = await controller.createQuest(
      { title: "Test Quest" } as any,
      "user-id"
    );
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.devirl.com/dev-quest-service/quest/create/user-id",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      })
    );
  });

  it("throws on createQuest failure", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      statusText: "Bad Request",
    }) as any;

    await expect(() =>
      controller.createQuest({ title: "Fail Quest" } as any, "user-id")
    ).rejects.toThrow("Error: Bad Request");
  });

  it("streams quests from ND-JSON stream", async () => {
    const chunks = ['{"id":1,"title":"Quest 1"}\n{"id":2,"title":"Quest 2"}\n'];
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        chunks.forEach((c) => controller.enqueue(encoder.encode(c)));
        controller.close();
      },
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: stream,
    }) as any;

    const results: any[] = [];
    for await (const quest of controller.streamAllQuests("user-id")) {
      results.push(quest);
    }

    expect(results).toEqual([
      { id: 1, title: "Quest 1" },
      { id: 2, title: "Quest 2" },
    ]);
  });
});
