import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "@/server/api/auth/logout";
import { getIronSession } from "iron-session";
import { $fetch } from "ofetch";
import { createEvent } from "h3";

// Mocks
vi.mock("ofetch", () => ({
  $fetch: vi.fn(),
}));

vi.mock("iron-session", () => ({
  getIronSession: vi.fn(),
}));

// Env setup
process.env.NUXT_PUBLIC_AUTH0_DOMAIN = "test.auth0.com";
process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID = "client123";
process.env.SESSION_SECRET = "test-secret";

describe("logout API handler", () => {
  const userId = "user-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes Redis session, destroys session, clears cookies, and redirects", async () => {
    const destroy = vi.fn();
    (getIronSession as any).mockResolvedValue({
      user: { sub: userId },
      destroy,
    });

    const req = new Request("http://localhost/api/auth/logout");
    const res = {
      setHeader: vi.fn(),
      getHeader: vi.fn().mockReturnValue([]), // ✅ Fix for H3 setCookie
      end: vi.fn(),
      statusCode: 200,
    };

    const event = createEvent({ req });
    (event as any).node.req = req;
    (event as any).node.res = res;

    await handler(event);

    expect($fetch).toHaveBeenCalledWith(
      `http://localhost:8080/dev-quest-service/auth/session/delete/${userId}`,
      { method: "DELETE" }
    );

    expect(destroy).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith(
      "location",
      expect.stringContaining("https://test.auth0.com/v2/logout?")
    );
    expect(res.statusCode).toBe(302);
    expect(res.end).toHaveBeenCalled();
  });

  it("skips Redis deletion if no session user", async () => {
    const destroy = vi.fn();
    (getIronSession as any).mockResolvedValue({ destroy });

    const req = new Request("http://localhost/api/auth/logout");
    const res = {
      setHeader: vi.fn(),
      getHeader: vi.fn().mockReturnValue([]), // ✅ Fix added here too
      end: vi.fn(),
      statusCode: 200,
    };

    const event = createEvent({ req });
    (event as any).node.req = req;
    (event as any).node.res = res;

    await handler(event);

    expect($fetch).not.toHaveBeenCalled();
    expect(destroy).toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith(
      "location",
      expect.stringContaining("https://test.auth0.com/v2/logout?")
    );
    expect(res.statusCode).toBe(302);
    expect(res.end).toHaveBeenCalled();
  });
});
