import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerUserRequest } from "../../connectors/RegistrationConnector";
import { submitRegisterUser } from "../../controllers/RegistrationController";

// Mock the connector function
vi.mock("@/connectors/RegistrationConnector", () => ({
  registerUserRequest: vi.fn(),
}));

// // Mock $fetch for session refresh
globalThis.$fetch = vi.fn();

describe("submitRegisterUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success when update and session refresh succeed", async () => {
    (registerUserRequest as any).mockResolvedValueOnce(undefined);
    ($fetch as any).mockResolvedValueOnce(undefined);

    const result = await submitRegisterUser("user123", {
      username: "testuser",
      firstName: "Bob",
      lastName: "Smith",
      userType: "Client",
    });

    expect(registerUserRequest).toHaveBeenCalledWith("user123", {
      username: "testuser",
      firstName: "Bob",
      lastName: "Smith",
      userType: "Client",
    });

    expect($fetch).toHaveBeenCalledWith("/api/auth/refresh-session", {
      method: "POST",
      credentials: "include",
    });

    expect(result).toEqual({ success: true });
  });

  it("returns error if user ID is missing", async () => {
    const result = await submitRegisterUser(undefined, {
      username: "testuser",
      firstName: "Bob",
      lastName: "Smith",
      userType: "Client",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("User ID is missing");
  });

  it("returns Zod validation error for invalid data", async () => {
    const result = await submitRegisterUser("user123", {
      username: "", // assume your schema requires non-empty
      firstName: "",
      lastName: "",
      userType: "", // and valid enum
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Invalid enum value|Required/); // depends on your schema
  });

  it("returns backend error message if present", async () => {
    (registerUserRequest as any).mockRejectedValueOnce({
      data: { message: "Internal server error" },
    });

    const result = await submitRegisterUser("user123", {
      username: "testuser",
      firstName: "Bob",
      lastName: "Smith",
      userType: "Client",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Internal server error");
  });

  it("returns fallback error message if no message is available", async () => {
    (registerUserRequest as any).mockRejectedValueOnce(new Error("boom"));

    const result = await submitRegisterUser("user123", {
      username: "testuser",
      firstName: "Bob",
      lastName: "Smith",
      userType: "Client",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Something went wrong");
  });
});
