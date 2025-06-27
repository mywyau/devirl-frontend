import { beforeEach, describe, expect, it, vi } from "vitest";
import * as connector from "../../connectors/QuestConnector";
import * as controller from "../../controllers/QuestBackendController";
import type {
    CreateQuestSchema,
    QuestPartial
} from "../../types/schema/QuestStatusSchema";

vi.mock("@/connectors/QuestConnector", async () => {
  const actual = await vi.importActual("@/connectors/QuestConnector");
  return {
    ...actual,
    getQuestRequest: vi.fn(),
    createQuestRequest: vi.fn(),
    updateQuestRequest: vi.fn(),
    deleteQuestRequest: vi.fn(),
    completeQuestRequest: vi.fn(),
    updateQuestStatusRequest: vi.fn(),
    acceptQuestRequest: vi.fn(),
    fetchNDJSONStreamRequest: vi.fn(),
  };
});

describe("QuestController", () => {
  const userId = "user123";
  const questId = "quest789";
  const questPartial: QuestPartial = {
    questId: questId,
    clientId: "client123",
    devId: "dev123",
    rank: "Steel",
    title: "Quest Title 1",
    description: "Some Description Criteria",
    acceptanceCriteria: "Some Acceptance Criteria",
    status: "Open",
    tags: ["Python", "TypeScript"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getQuest → returns parsed quest on valid response", async () => {
    vi.mocked(connector.getQuestRequest).mockResolvedValueOnce(questPartial);

    const result = await controller.getQuest(userId, questId);
    expect(result).toEqual(questPartial);
  });

  it("getQuest → throws on invalid quest schema", async () => {
    vi.mocked(connector.getQuestRequest).mockResolvedValueOnce({
      id: 123, // invalid id type
    });

    await expect(() => controller.getQuest(userId, questId)).rejects.toThrow(
      "Invalid quest data received from backend"
    );
  });

  it("createQuest → proxies to connector", async () => {
    const payload = {
      title: "Test Quest",
      rank: "bronze",
      acceptanceCriteria: "Complete steps A/B/C",
      description: "Test",
      tags: [],
    } satisfies CreateQuestSchema;

    await controller.createQuest(userId, payload);
    expect(connector.createQuestRequest).toHaveBeenCalledWith(userId, payload);
  });

  it("deleteQuest → proxies to connector", async () => {
    await controller.deleteQuest(userId, questId);
    expect(connector.deleteQuestRequest).toHaveBeenCalledWith(userId, questId);
  });

  it("streamAllQuests → yields parsed lines", async () => {
    const mockBody = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            JSON.stringify({ id: "q1" }) + "\n" + JSON.stringify({ id: "q2" })
          )
        );
        controller.close();
      },
    });

    vi.mocked(connector.fetchNDJSONStreamRequest).mockResolvedValueOnce({
      ok: true,
      body: mockBody,
    } as Response);

    const results = [];
    for await (const q of controller.streamAllQuests(userId)) {
      results.push(q);
    }

    expect(results).toEqual([{ id: "q1" }, { id: "q2" }]);
  });

  it("streamAllQuests → throws on non-ok response", async () => {
    vi.mocked(connector.fetchNDJSONStreamRequest).mockResolvedValueOnce({
      ok: false,
      status: 500,
      body: null,
    } as Response);

    await expect(async () => {
      for await (const _ of controller.streamAllQuests(userId)) {
        // no-op
      }
    }).rejects.toThrow("[streamQuests] Failed: 500");
  });
});
