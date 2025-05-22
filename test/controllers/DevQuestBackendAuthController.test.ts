import { describe, it, expect, vi, beforeEach } from "vitest";
import { DevQuestBackendAuthController } from "@/controllers/DevQuestBackendAuthController";

// Mocks
vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: { baseUrl: "https://mock-backend.com" },
  }),
}));

// Mock $fetch from ofetch
vi.mock("ofetch", async () => {
  const actual = await vi.importActual("ofetch");
  return {
    ...actual,
    $fetch: vi.fn(),
  };
});

import { $fetch } from "ofetch";

describe("DevQuestBackendAuthController", () => {
  let controller: DevQuestBackendAuthController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new DevQuestBackendAuthController();
  });

  it("computes correct session URL", async () => {
    const url = (controller as any).storeSessionUrl("user123");
    expect(url).toBe("https://mock-backend.com/auth/session/user123");
  });

  it("stores session successfully", async () => {
    const mockResponse = { success: true, message: "stored" };
    ($fetch as any).mockResolvedValue(mockResponse);

    const result = await controller.storeCookieSessionInRedis("user123");
    expect(result).toEqual(mockResponse);

    expect($fetch).toHaveBeenCalledWith(
      "https://mock-backend.com/auth/session/user123",
      {
        method: "POST",
        credentials: "include",
      }
    );
  });

  it("throws error with backend message", async () => {
    ($fetch as any).mockRejectedValue({
      data: { message: "Redis failure" },
    });

    await expect(
      controller.storeCookieSessionInRedis("user123")
    ).rejects.toThrow("Redis failure");
  });

  it("throws error with generic message", async () => {
    ($fetch as any).mockRejectedValue({
      message: "Network error",
    });

    await expect(
      controller.storeCookieSessionInRedis("user123")
    ).rejects.toThrow("Network error");
  });

  it("throws unknown error if no message is provided", async () => {
    ($fetch as any).mockRejectedValue({});

    await expect(
      controller.storeCookieSessionInRedis("user123")
    ).rejects.toThrow("Unknown error occurred while storing session");
  });
});
