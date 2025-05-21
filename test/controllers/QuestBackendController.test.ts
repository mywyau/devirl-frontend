import { describe, it, expect, vi, beforeEach } from "vitest";
import { QuestBackendController } from "@/controllers/QuestBackendController";
import { QuestPartialSchema } from "@/types/schema/QuestStatusSchema";

vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: { baseUrl: "https://mock-backend.com" },
  }),
}));

const mockQuestPartial = {
  userId: "user123",
  questId: "quest123",
  title: "Test Quest",
  description: "Some test description",
  status: "InProgress",
};


describe("QuestBackendController URL methods", () => {
  const controller = new QuestBackendController();

  it("generates correct getQuestUrl", () => {
    const url = controller.getQuestUrl("user1", "quest1");
    expect(url).toBe("https://mock-backend.com/quest/user1/quest1");
  });

  it("generates correct deleteQuestUrl", () => {
    const url = controller.deleteQuestUrl("user1", "quest1");
    expect(url).toBe("https://mock-backend.com/quest/user1/quest1");
  });

  it("generates correct createQuestUrl", () => {
    const url = controller.createQuestUrl("user1");
    expect(url).toBe("https://mock-backend.com/quest/create/user1");
  });

  it("generates correct updateQuestUrl", () => {
    const url = controller.updateQuestUrl("user1", "quest1");
    expect(url).toBe("https://mock-backend.com/quest/update/user1/quest1");
  });
});

describe("QuestBackendController getQuest", () => {
  const controller = new QuestBackendController();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns parsed quest if valid", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => mockQuestPartial,
      ok: true,
    });

    const result = await controller.getQuest("user1", "quest123");
    expect(result).toEqual(expect.objectContaining(mockQuestPartial));
  });

  it("throws error if response is invalid", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => ({}),
      ok: true,
    });

    await expect(controller.getQuest("user1", "badid")).rejects.toThrow(
      "Invalid quest data received from backend"
    );
  });
});

describe("QuestBackendController createQuest", () => {
  const controller = new QuestBackendController();

  it("POSTs the quest and returns response", async () => {
    const mockResponse = { success: true };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => mockResponse,
    });

    const result = await controller.createQuest({ title: "New" }, "user1");
    expect(result).toEqual(mockResponse);
  });

  it("throws on failed request", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, statusText: "Bad" });

    await expect(
      controller.createQuest({ title: "New" }, "user1")
    ).rejects.toThrow("Error: Bad");
  });
});

describe("QuestBackendController deleteQuest", () => {
  const controller = new QuestBackendController();

  it("succeeds if status is ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    await expect(controller.deleteQuest("user1", "q1")).resolves.toBeUndefined();
  });

  it("throws on failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 403 });

    await expect(controller.deleteQuest("user1", "q1")).rejects.toThrow(
      "[deleteQuest] Failed with status 403"
    );
  });
});


