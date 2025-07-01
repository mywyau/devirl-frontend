import { describe, it, expect, vi, beforeEach } from "vitest";
import { DevQuestBackendAuthConnector } from "../../connectors/DevQuestBackendAuthConnector";
import { $fetch } from "ofetch";

// Mock ofetch globally
vi.mock("ofetch", () => ({
  $fetch: vi.fn(),
}));

const mockConfig = {
  devQuestBackend: {
    baseUrl: "https://api.example.com",
  },
};

describe("DevQuestBackendAuthConnector", () => {
  let connector: DevQuestBackendAuthConnector;

  beforeEach(() => {
    vi.clearAllMocks();
    connector = new DevQuestBackendAuthConnector(mockConfig, "/");
  });

  it("calls storeSession with credentials when no cookie", async () => {
    const mockResponse = { success: true };
    ($fetch as any).mockResolvedValue(mockResponse);

    const result = await connector.storeSession("user123");

    expect($fetch).toHaveBeenCalledWith(
      "https://api.example.com/auth/session/user123",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("calls storeSession with cookie header when provided", async () => {
    const mockResponse = { success: true };
    ($fetch as any).mockResolvedValue(mockResponse);

    const result = await connector.storeSession("user123", "session=abc");

    expect($fetch).toHaveBeenCalledWith(
      "https://api.example.com/auth/session/user123",
      expect.objectContaining({
        method: "POST",
        headers: {
          cookie: "session=abc",
        },
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it("calls deleteSession with cookie header", async () => {
    const mockResponse = { success: true };
    ($fetch as any).mockResolvedValue(mockResponse);

    const result = await connector.deleteSession("user123", "session=abc");

    expect($fetch).toHaveBeenCalledWith(
      "https://api.example.com/auth/session/delete/user123",
      expect.objectContaining({
        method: "POST",
        headers: {
          cookie: "session=abc",
        },
      })
    );
    expect(result).toEqual(mockResponse);
  });
});
