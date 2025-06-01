import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getQuest,
  createQuest,
  updateQuest,
  deleteQuest,
} from "@/controllers/QuestBackendController.ts";

vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: { baseUrl: "https://mock-backend.com" },
  }),
}));

vi.mock("ofetch", async () => {

  const actual = await vi.importActual("ofetch");

  return {
    ...actual,
    $fetch: vi.fn(),
  };
});

import { $fetch } from "ofetch";

const mockQuestPartial = {
  clientId: "quest123",
  questId: "quest123",
  title: "Test Quest",
  description: "Some test description",
  status: "InProgress",
};

describe("questBackend - getQuest", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns parsed quest if valid", async () => {
    ($fetch as any).mockResolvedValue(mockQuestPartial);

    const result = await getQuest("user1", "quest123");
    expect(result).toEqual(expect.objectContaining(mockQuestPartial));
  });

  it("throws if quest is invalid", async () => {
    ($fetch as any).mockResolvedValue({});

    await expect(getQuest("user1", "invalid")).rejects.toThrow(
      "Invalid quest data received from backend"
    );
  });
});

describe("questBackend - createQuest", () => {
  it("POSTs the quest and returns response", async () => {
    const mockResponse = { success: true };
    ($fetch as any).mockResolvedValue(mockResponse);

    const result = await createQuest("user1", { title: "New" });
    expect(result).toEqual(mockResponse);
  });

  it("throws if backend returns error", async () => {
    ($fetch as any).mockRejectedValue(new Error("Backend error"));

    await expect(createQuest("user1", { title: "New" })).rejects.toThrow(
      "Backend error"
    );
  });
});

describe("questBackend - deleteQuest", () => {

  it("succeeds if status is ok", async () => {
    ($fetch as any).mockResolvedValue({});

    await expect(deleteQuest("user1", "quest1")).resolves.not.toThrow();
  });

  it("throws if request fails", async () => {
    ($fetch as any).mockRejectedValue(new Error("Unauthorized"));

    await expect(deleteQuest("user1", "quest1")).rejects.toThrow(
      "Unauthorized"
    );
  });
});

describe("questBackend - updateQuest", () => {
  it("PUTs the quest and returns response", async () => {
    const mockResponse = { success: true };
    ($fetch as any).mockResolvedValue(mockResponse);

    const result = await updateQuest("user1", "quest1", {
      title: "Updated Title",
    });

    expect(result).toEqual(mockResponse);
  });

  it("throws on failure", async () => {
    ($fetch as any).mockRejectedValue(new Error("Update failed"));

    await expect(
      updateQuest("user1", "quest1", { title: "New" })
    ).rejects.toThrow("Update failed");
  });
});
