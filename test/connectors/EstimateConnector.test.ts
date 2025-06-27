import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchEstimates, postEstimate } from "../../connectors/EstimateConnector";
import { $fetch } from "ofetch";

// Mock $fetch globally
vi.mock("ofetch", () => ({
  $fetch: vi.fn(),
}));

// Mock loadConfig
vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: {
      baseUrl: "https://api.example.com",
    },
  }),
}));

describe("EstimateConnector", () => {
  const userId = "dev123";
  const questId = "quest456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchEstimates should call $fetch with correct GET URL and options", async () => {
    const mockResponse = [{ some: "estimate" }];
    vi.mocked($fetch).mockResolvedValueOnce(mockResponse);

    const result = await fetchEstimates(userId, questId, {
      headers: { Authorization: "Bearer token" },
    });

    expect($fetch).toHaveBeenCalledWith(
      "https://api.example.com/estimates/dev123/quest456",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: { Authorization: "Bearer token" },
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("postEstimate should call $fetch with correct POST URL and body", async () => {
    const payload = {
      questId: "quest456",
      rank: "steel",
      reasoning: "Challenging but doable",
    };

    const mockResponse = { success: true };
    vi.mocked($fetch).mockResolvedValueOnce(mockResponse);

    const result = await postEstimate(userId, payload);

    expect($fetch).toHaveBeenCalledWith(
      "https://api.example.com/estimate/create/dev123",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: payload,
      })
    );
    expect(result).toEqual(mockResponse);
  });
});
