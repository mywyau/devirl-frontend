import { describe, it, expect, vi, beforeEach } from "vitest";
import { authenticateUser } from "@/server/api/auth/callback"; // adjust path if needed
import { getUserInfo } from "@/server/utils/auth0";

// Mock the h3 createError function
vi.mock("h3", async () => {
  const actual = await vi.importActual<any>("h3");
  return {
    ...actual,
    createError: ({ statusCode, message }: any) =>
      new Error(`${message} (${statusCode})`),
  };
});

// Mock getUserInfo function
vi.mock("@/server/utils/auth0", () => ({
  getUserInfo: vi.fn(),
}));

describe("authenticateUser", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns user and userId when user has a valid sub", async () => {
    const mockUser = {
      sub: "auth0|user123",
      email: "user@example.com",
    };

    (getUserInfo as vi.Mock).mockResolvedValue(mockUser);

    const result = await authenticateUser("fake-access-token");

    expect(getUserInfo).toHaveBeenCalledWith("fake-access-token");
    expect(result).toEqual({
      user: mockUser,
      userId: "auth0|user123",
    });
  });

  it("throws an error when user ID (sub) is missing", async () => {
    (getUserInfo as vi.Mock).mockResolvedValue({}); // sub is missing

    await expect(authenticateUser("fake-access-token")).rejects.toThrow(
      "Missing user ID"
    );
  });

  it("throws an error when getUserInfo returns null", async () => {
    (getUserInfo as vi.Mock).mockResolvedValue(null);

    await expect(authenticateUser("fake-access-token")).rejects.toThrow(
      "Missing user ID"
    );
  });
});
