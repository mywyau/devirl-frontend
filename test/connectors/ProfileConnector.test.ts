import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAllProfileSkillData } from "../../connectors/ProfileConnector";
import { $fetch } from "ofetch";

// Mock $fetch
vi.mock("ofetch", () => ({
  $fetch: vi.fn(),
}));

// Mock loadConfig
vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: {
      baseUrl: "https://api.example.com/",
    },
  }),
}));

describe("ProfileConnector", () => {
  const devId = "dev123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchAllProfileSkillData calls $fetch with correct URL and options", async () => {
    const mockResponse = [{ ok: true }];
    vi.mocked($fetch).mockResolvedValueOnce(mockResponse);

    const result = await fetchAllProfileSkillData(devId, {
      headers: { Authorization: "Bearer token" },
    });

    expect($fetch).toHaveBeenCalledWith(
      "https://api.example.com/profile/skill/language/data/dev123",
      expect.objectContaining({
        credentials: "include",
        headers: { Authorization: "Bearer token" },
      })
    );
    expect(result).toEqual(mockResponse);
  });
});
