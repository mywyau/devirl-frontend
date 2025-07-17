import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUserNuxtServerToScalaServer, registerUserRequest } from "../../connectors/RegistrationConnector";
import { $fetch } from "ofetch";

// Mock $fetch
vi.mock("ofetch", () => ({
  $fetch: vi.fn(),
}));

const mockedFetch = $fetch as unknown as ReturnType<typeof vi.fn>;

describe("registration connector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUserNuxtServerToScalaServer", () => {
    it("sends POST request with userId and cookie", async () => {
      const userId = "user-123";
      const cookieHeader = "cookie=value";
      const payload = {
        username: "alice",
        userType: "Client",
      };

      mockedFetch.mockResolvedValueOnce({ success: true });

      const result = await createUserNuxtServerToScalaServer(userId, cookieHeader, payload);

      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/registration/data/create/${encodeURIComponent(userId)}`),
        {
          method: "POST",
          headers: { cookie: cookieHeader },
          body: payload,
        }
      );

      expect(result).toEqual({ success: true });
    });

    it("throws on fetch failure", async () => {
      mockedFetch.mockRejectedValueOnce(new Error("backend error"));

      await expect(() =>
        createUserNuxtServerToScalaServer("u1", "c", { username: "x", userType: "Dev" })
      ).rejects.toThrow("backend error");
    });
  });

  describe("registerUserRequest", () => {
    it("sends PUT request with correct payload", async () => {
      const userId = "user-456";
      const payload = {
        username: "bob",
        userType: "Dev",
      };

      mockedFetch.mockResolvedValueOnce({ success: true });

      const result = await registerUserRequest(userId, payload);

      expect(mockedFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/registration/update/user/type/${encodeURIComponent(userId)}`),
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: payload,
        }
      );

      expect(result).toEqual({ success: true });
    });

    it("throws on fetch failure", async () => {
      mockedFetch.mockRejectedValueOnce(new Error("update failed"));

      await expect(() =>
        registerUserRequest("user-456", { username: "bob", userType: "Dev" })
      ).rejects.toThrow("update failed");
    });
  });
});
