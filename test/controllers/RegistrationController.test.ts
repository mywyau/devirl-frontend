import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitUserTypeUpdate } from "../../controllers/RegistrationController";
import { updateUserType } from "../../connectors/RegistrationConnector";

// Mock the connector function
vi.mock("@/connectors/RegistrationConnector", () => ({
  updateUserType: vi.fn(),
}));

// Mock $fetch for session refresh
globalThis.$fetch = vi.fn();

describe("submitUserTypeUpdate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success when update and session refresh succeed", async () => {
    (updateUserType as any).mockResolvedValueOnce(undefined);
    ($fetch as any).mockResolvedValueOnce(undefined);

    const result = await submitUserTypeUpdate("user123", {
      username: "testuser",
      userType: "Client",
    });

    expect(updateUserType).toHaveBeenCalledWith("user123", {
      username: "testuser",
      userType: "Client",
    });

    expect($fetch).toHaveBeenCalledWith("/api/auth/refresh-session", {
      method: "POST",
      credentials: "include",
    });

    expect(result).toEqual({ success: true });
  });

  it("returns error if user ID is missing", async () => {
    const result = await submitUserTypeUpdate(undefined, {
      username: "testuser",
      userType: "Client",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("User ID is missing");
  });

  it("returns Zod validation error for invalid data", async () => {
    const result = await submitUserTypeUpdate("user123", {
      username: "", // assume your schema requires non-empty
      userType: "", // and valid enum
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid enum value|Required/); // depends on your schema
  });

  it("returns backend error message if present", async () => {
    (updateUserType as any).mockRejectedValueOnce({
      data: { message: "Internal server error" },
    });

    const result = await submitUserTypeUpdate("user123", {
      username: "testuser",
      userType: "Client",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Internal server error");
  });

  it("returns fallback error message if no message is available", async () => {

    (updateUserType as any).mockRejectedValueOnce(new Error("boom"));

    const result = await submitUserTypeUpdate("user123", {
      username: "testuser",
      userType: "Client",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Something went wrong");
  });
});
