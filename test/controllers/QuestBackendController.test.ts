import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { QuestBackendController } from "../../controllers/QuestBackendController";

const mockConfig = {
  devQuestBackend: {
    baseUrl: "https://devirl.com/dev-quest",
  },
};

vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => mockConfig,
}));

describe("QuestBackendController", () => {
  const controller = new QuestBackendController();

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should construct the correct quest URL", () => {
    const url = controller.getQuestUrl("abc123");
    expect(url).toBe("https://devirl.com/dev-quest/dev-quest-service/quest/abc123");
  });

  it("should call fetch with the correct URL on getQuest", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ id: "abc123", name: "Test Quest" }),
    };

    (fetch as any).mockResolvedValue(mockResponse);

    const response = await controller.getQuest("abc123");

    expect(fetch).toHaveBeenCalledWith(
      "https://devirl.com/dev-quest/dev-quest-service/quest/abc123",
      { credentials: "include" }
    );

    const data = await response.json();
    expect(data.name).toBe("Test Quest");
  });

  it("should POST to createQuest with correct payload", async () => {
    const mockPayload = { title: "New Quest" };
    const mockUserId = "user-123";

    const mockResponse = {
      ok: true,
      json: async () => ({ success: true }),
    };

    (fetch as any).mockResolvedValue(mockResponse);

    const result = await controller.createQuest(mockPayload, mockUserId);

    expect(fetch).toHaveBeenCalledWith(
      "https://devirl.com/dev-quest/dev-quest-service/quest/create/user-123",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockPayload),
        credentials: "include",
      }
    );

    expect(result).toEqual({ success: true });
  });
});
