import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchLanguage,
  fetchHiscoreLanguage,
} from "../../connectors/LanguageConnector";
import { $fetch } from "ofetch";

// Mock $fetch from ofetch
vi.mock("ofetch", () => ({
  $fetch: vi.fn(),
}));

// Mock loadConfig to provide baseUrl
vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: {
      baseUrl: "https://api.example.com",
    },
  }),
}));

describe("LanguageConnector", () => {
  const devId = "dev123";
  const language = "typescript";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchLanguage should call $fetch with correct URL and headers", async () => {
    const mockResponse = { username: "dev123", rank: "steel", comment: "Solid" };
    vi.mocked($fetch).mockResolvedValueOnce(mockResponse);

    const result = await fetchLanguage(devId, language, {
      headers: { Authorization: "Bearer token" },
    });

    expect($fetch).toHaveBeenCalledWith(
      "https://api.example.com/language/typescript/dev123",
      expect.objectContaining({
        credentials: "include",
        headers: { Authorization: "Bearer token" },
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it("fetchHiscoreLanguage should call $fetch with correct URL and method GET", async () => {
    const mockResponse = [
      { username: "devA", rank: "mithril", comment: "Excellent" },
    ];
    vi.mocked($fetch).mockResolvedValueOnce(mockResponse);

    const result = await fetchHiscoreLanguage(language, {
      headers: { Authorization: "Bearer token" },
    });

    expect($fetch).toHaveBeenCalledWith(
      "https://api.example.com/hiscore/language/typescript",
      expect.objectContaining({
        method: "GET",
        credentials: "include",
        headers: { Authorization: "Bearer token" },
      })
    );

    expect(result).toEqual(mockResponse);
  });
});
