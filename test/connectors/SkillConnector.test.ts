import { $fetch } from "ofetch";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchHiscoreSkill, fetchSkill } from "../../connectors/SkillConnector";

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

describe("SkillConnector", () => {
    
  const devId = "dev123";
  const skill = "typescript";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchSkill should call $fetch with the correct URL and headers", async () => {
    const mockResponse = { ok: true };
    vi.mocked($fetch).mockResolvedValueOnce(mockResponse);

    const result = await fetchSkill(devId, skill, {
      headers: { Authorization: "Bearer token" },
    });

    expect($fetch).toHaveBeenCalledWith(
      "https://api.example.com/skill/typescript/dev123",
      expect.objectContaining({
        credentials: "include",
        headers: { Authorization: "Bearer token" },
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("fetchHiscoreSkill should call $fetch with the correct URL and method GET", async () => {
    const mockResponse = [{ ok: true }];
    vi.mocked($fetch).mockResolvedValueOnce(mockResponse);

    const result = await fetchHiscoreSkill(skill, {
      headers: { Authorization: "Bearer token" },
    });

    expect($fetch).toHaveBeenCalledWith(
      "https://api.example.com/hiscore/skill/typescript",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: { Authorization: "Bearer token" },
      })
    );
    expect(result).toEqual(mockResponse);
  });
});
