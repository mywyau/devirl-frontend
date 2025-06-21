import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createQuest,
  deleteQuest,
  getQuest,
  updateQuest,
} from "../../controllers/QuestBackendController.ts";

import { type QuestPartial } from "../../types/schema/QuestStatusSchema";

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

// questId: z.string(),
//   clientId: z.string(),
//   devId: z.string().nullable().optional(),
//   rank: z.string(),
//   title: z.string(),
//   description: z.string().nullable().optional(),
//   acceptanceCriteria: z.string().nullable().optional(),
//   status: QuestStatusSchema,
//   tags: z.array(z.string()).min(1, "At least one tag is required"),

const mockQuestPartial: QuestPartial = {
  questId: "quest123",
  clientId: "quest123",
  devId: "devId123",
  rank: "Iron",
  title: "Test Quest",
  description: "Some test description",
  acceptanceCriteria: "Some acceptance criteria",
  status: "InProgress",
  tags: ["Python", "Typescript", "Rust"],
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

    const payload = {
      rank: "Iron",
      title: "Updated Title",
      description: "Updated Description",
      acceptanceCriteria: "Updated Acceptance Criteria",
    };

    const result = await updateQuest("user1", "quest1", payload);

    expect(result).toEqual(mockResponse);
  });

  it("throws on failure", async () => {
    ($fetch as any).mockRejectedValue(new Error("Update failed"));

    const payload = {
      rank: "Iron",
      title: "Updated Title",
      description: "Updated Description",
      acceptanceCriteria: "Updated Acceptance Criteria",
    };

    await expect(updateQuest("user1", "quest1", payload)).rejects.toThrow(
      "Update failed"
    );
  });
});
