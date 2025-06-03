import { describe, it, expect, vi, beforeEach } from "vitest";
import { storeSession } from "@/server/api/auth/callback"; // adjust path
import { getIronSession } from "iron-session";
// import { getSessionCookieHeader } from "@/server/api/auth/callback"; // adjust path
import { getSessionCookieHeader } from "@/utils/CallbackHelpers";


vi.mock("iron-session", () => ({
  getIronSession: vi.fn(),
}));

vi.mock("@/utils/CallbackHelpers", () => ({
  getSessionCookieHeader: vi.fn(() => "session=abc123"),
}));


describe("storeSession", () => {
  const mockSave = vi.fn();
  const mockGetHeader = vi.fn(() => "session=abc123");

  const mockEvent = {
    node: {
      req: {},
      res: {
        getHeader: mockGetHeader,
        setHeader: vi.fn(),
      },
    },
  };

  const mockUser = {
    sub: "auth0|user123",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (getIronSession as vi.Mock).mockResolvedValue({
      user: null,
      save: mockSave,
    });
  });

  it("stores the session and returns the cookie header", async () => {
    const result = await storeSession(mockEvent, mockUser);

    expect(getIronSession).toHaveBeenCalledWith(
      mockEvent.node.req,
      mockEvent.node.res,
      expect.any(Object)
    );

    expect(mockSave).toHaveBeenCalled();
    expect(getSessionCookieHeader).toHaveBeenCalledWith("session=abc123");
    expect(result).toBe("session=abc123");
  });
});
