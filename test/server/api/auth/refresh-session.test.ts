import { describe, it, expect, vi, beforeEach } from "vitest";
import refreshSessionHandler from "@/server/api/auth/refresh-session";
import { createEvent } from "h3";

vi.mock("iron-session", () => ({
  getIronSession: vi.fn(),
}));

vi.mock("ofetch", () => ({
  $fetch: vi.fn(),
}));

vi.mock("h3", async () => {
  const actual = await vi.importActual<typeof import("h3")>("h3");
  return {
    ...actual,
    setCookie: vi.fn(),
  };
});

vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: {
      baseUrl: "https://mock-backend.com",
    },
  }),
}));

const { getIronSession } = await import("iron-session");
const { $fetch } = await import("ofetch");
const { setCookie } = await import("h3");

describe("refreshSessionHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockEvent = (cookieHeader = "auth_session=xyz123") => ({
    node: {
      req: {
        headers: {
          cookie: cookieHeader,
        },
      },
      res: {},
    },
  });

  it("throws 401 when user is not in session", async () => {
    const mockSession = {
      user: undefined,
    };
    getIronSession.mockResolvedValue(mockSession);

    const event = createMockEvent();

    await expect(refreshSessionHandler(event)).rejects.toHaveProperty(
      "statusCode",
      401
    );
    
    await expect(refreshSessionHandler(event)).rejects.toHaveProperty(
      "statusMessage",
      "User not authenticated"
    );
  });

  it("refetches user data and sets user_type cookie", async () => {
    const mockSession = {
      user: { sub: "user123" },
      save: vi.fn(),
    };
    getIronSession.mockResolvedValue(mockSession);
    $fetch.mockResolvedValue({ userType: "Dev" });

    const event = createMockEvent("auth_session=session-token");

    const result = await refreshSessionHandler(event);

    expect($fetch).toHaveBeenCalledWith(
      "https://mock-backend.com/registration/user/data/user123",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          cookie: "auth_session=session-token",
        }),
      })
    );

    expect(setCookie).toHaveBeenCalledWith(
      event,
      "user_type",
      "Dev",
      expect.objectContaining({
        httpOnly: false,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 8,
      })
    );

    expect(mockSession.save).toHaveBeenCalled();
    expect(result).toEqual({ success: true, userType: "Dev" });
  });

  it("handles absence of auth_session cookie gracefully", async () => {
    const mockSession = {
      user: { sub: "user123" },
      save: vi.fn(),
    };
    getIronSession.mockResolvedValue(mockSession);
    $fetch.mockResolvedValue({ userType: "Client" });

    const event = createMockEvent(""); // no cookie header

    const result = await refreshSessionHandler(event);

    expect($fetch).toHaveBeenCalledWith(
      "https://mock-backend.com/registration/user/data/user123",
      expect.objectContaining({
        headers: {
          cookie: "",
        },
      })
    );

    expect(setCookie).toHaveBeenCalledWith(
      event,
      "user_type",
      "Client",
      expect.any(Object)
    );

    expect(result).toEqual({ success: true, userType: "Client" });
  });

  it("does not set user_type cookie if userType is missing in backend response", async () => {
    const mockSession = {
      user: { sub: "user123" },
      save: vi.fn(),
    };
    getIronSession.mockResolvedValue(mockSession);
    $fetch.mockResolvedValue({}); // no userType

    const event = createMockEvent();

    const result = await refreshSessionHandler(event);

    expect(setCookie).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true, userType: null });
  });
});
