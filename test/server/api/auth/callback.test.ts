
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAccessToken } from "@/server/api/auth/callback"; // adjust if it's in utils or another file
import { exchangeCodeForToken } from "@/server/utils/auth0";


vi.mock("@/server/utils/auth0", () => ({
  exchangeCodeForToken: vi.fn(),
}));

// Mock event helper
function createMockEvent(code?: string) {
  return {
    node: {
      req: {},
      res: {},
    },
    context: {},
    method: "GET",
    path: "/api/auth/callback",
    query: code ? { code } : {},
  };
}

// Helper if using getQuery from H3
vi.mock("h3", async () => {
  const actual = await vi.importActual<any>("h3");
  return {
    ...actual,
    getQuery: (event: any) => event.query,
    createError: actual.createError,
  };
});

describe("getAccessToken", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL = "https://example.com/callback";
  });

  it("throws an error if code is missing", async () => {
    const event = createMockEvent();
    await expect(getAccessToken(event)).rejects.toThrow("Missing code");
  });

  it("returns access token when code is provided", async () => {
    const event = createMockEvent("mock-code");
    (exchangeCodeForToken as vi.Mock).mockResolvedValue({ access_token: "abc123" });

    const token = await getAccessToken(event);
    expect(exchangeCodeForToken).toHaveBeenCalledWith("mock-code", "https://example.com/callback");
    expect(token).toBe("abc123");
  });
});





