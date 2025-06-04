import { describe, it, expect, vi, beforeEach } from "vitest";
import { getIronSession } from "iron-session";
import * as CallbackHelpers from "@/utils/CallbackHelpers"; // <-- import the full module
import { storeSession } from "@/utils/CallbackHelpers"; // <-- actual implementation

vi.mock("iron-session", () => ({
  getIronSession: vi.fn(),
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

    // Spy on the real function
    vi.spyOn(CallbackHelpers, "getSessionCookieHeader");
  });

  it("stores the session and returns the cookie header", async () => {
    const result = await storeSession(mockEvent, mockUser);

    expect(getIronSession).toHaveBeenCalledWith(
      mockEvent.node.req,
      mockEvent.node.res,
      expect.any(Object)
    );

    expect(mockSave).toHaveBeenCalled();

    // expect(CallbackHelpers.getSessionCookieHeader).toHaveBeenCalledWith("session=abc123");
    expect(result).toBe("session=abc123");
  });
});
