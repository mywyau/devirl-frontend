import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUserNuxtServerToScalaServer, updateUserType } from "@/controllers/RegistrationController";
import type { UserData, UpdateUserTypePayload } from "@/types/schema/UserDataSchema";

// Mocks
vi.mock("ofetch", () => ({
  $fetch: vi.fn(),
}));

vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: {
      baseUrl: "https://mock-api.com",
    },
  }),
}));

const $fetch = (await import("ofetch")).$fetch as ReturnType<typeof vi.fn>;

describe("RegistrationController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createUserNuxtServerToScalaServer sends POST with cookie header and correct body", async () => {
    const mockUserId = "user123";
    const mockCookie = "auth=abc.def.ghi";
    const mockPayload: UserData = {
      userId: "user123",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      userType: "Dev",
    };

    const expectedUrl = `https://mock-api.com/registration/data/create/${mockUserId}`;

    $fetch.mockResolvedValueOnce({ success: true });

    const response = await createUserNuxtServerToScalaServer(mockUserId, mockCookie, mockPayload);

    expect($fetch).toHaveBeenCalledWith(expectedUrl, {
      method: "POST",
      headers: {
        cookie: mockCookie,
      },
      body: mockPayload,
    });

    expect(response).toEqual({ success: true });
  });

  it("updateUserType sends PUT with credentials and JSON body", async () => {
    const mockUserId = "dev456";
    const mockPayload: UpdateUserTypePayload = {
      userType: "Client",
    };

    const expectedUrl = `https://mock-api.com/registration/update/user/type/${mockUserId}`;

    $fetch.mockResolvedValueOnce({ updated: true });

    const response = await updateUserType(mockUserId, mockPayload);

    expect($fetch).toHaveBeenCalledWith(expectedUrl, {
      method: "PUT",
      credentials: "include",
      body: mockPayload,
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(response).toEqual({ updated: true });
  });
});
