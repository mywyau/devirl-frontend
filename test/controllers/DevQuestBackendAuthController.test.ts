import { beforeEach, describe, expect, it, vi } from "vitest";
import { DevQuestBackendAuthConnector } from "../../connectors/DevQuestBackendAuthConnector";
import { DevQuestBackendAuthController } from "../../controllers/DevQuestBackendAuthController";

vi.mock("@/connectors/DevQuestBackendAuthConnector");

describe("DevQuestBackendAuthController", () => {
  let controller: DevQuestBackendAuthController;
  let connectorMock: vi.mocked<DevQuestBackendAuthConnector>;

  beforeEach(() => {
    connectorMock = new DevQuestBackendAuthConnector() as any;
    controller = new DevQuestBackendAuthController(connectorMock);
    vi.clearAllMocks();
  });

  it("calls connector.storeSession (browser) and returns result", async () => {
    connectorMock.storeSession.mockResolvedValue({ success: true });

    const result = await controller.storeCookieSessionInRedis("user123");

    expect(connectorMock.storeSession).toHaveBeenCalledWith("user123");
    expect(result).toEqual({ success: true });
  });

  it("calls connector.storeSession (s2s) and returns result", async () => {
    connectorMock.storeSession.mockResolvedValue({ success: true });

    const result = await controller.storeCookieSessionInRedisServerToServer(
      "user123",
      "cookie=abc"
    );

    expect(connectorMock.storeSession).toHaveBeenCalledWith(
      "user123",
      "cookie=abc"
    );
    expect(result).toEqual({ success: true });
  });

  it("calls connector.deleteSession and returns result", async () => {
    connectorMock.deleteSession.mockResolvedValue({ success: true });

    const result = await controller.deleteCookieSessionInRedisServerToServer(
      "user123",
      "cookie=abc"
    );

    expect(connectorMock.deleteSession).toHaveBeenCalledWith(
      "user123",
      "cookie=abc"
    );
    expect(result).toEqual({ success: true });
  });

  it("throws readable error from backend error message", async () => {
    connectorMock.storeSession.mockRejectedValue({
      data: { message: "Bad session" },
    });

    await expect(
      controller.storeCookieSessionInRedis("user123")
    ).rejects.toThrow("Bad session");
  });

  it("throws generic error if no backend data message", async () => {
    connectorMock.storeSession.mockRejectedValue({
      message: "Something failed",
    });

    await expect(
      controller.storeCookieSessionInRedis("user123")
    ).rejects.toThrow("Something failed");
  });
});
