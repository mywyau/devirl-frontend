import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  fetchUserData,
  createUserData,
  updateUserDataType,
  deleteUserData,
} from "@/connectors/userDataConnector";
import { GetUserDataSchema } from "@/types/schema/UserDataSchema";
import type { CreateUserPayload, UpdateUserTypePayload } from "@/types/users";
import { $fetch } from "ofetch";

// Mock config loader
vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: {
      baseUrl: "https://mock-api.com",
    },
  }),
}));

vi.mock("ofetch", () => ({
  $fetch: vi.fn(),
}));

const mockedFetch = $fetch as unknown as ReturnType<typeof vi.fn>;

const mockUserId = "abc123";
const mockPayload: CreateUserPayload = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  userType: "Dev",
};

const mockUpdatePayload: UpdateUserTypePayload = {
  userType: "Client",
};

const validUserData = {
  userId: "abc123",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  userType: "Dev",
};

describe("userDataConnector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchUserData - returns validated user data", async () => {
    mockedFetch.mockResolvedValue(validUserData);

    const data = await fetchUserData(mockUserId);
    expect(data).toEqual(validUserData);
    expect(mockedFetch).toHaveBeenCalledWith(
      `https://mock-api.com/user/data/${mockUserId}`,
      { credentials: "include" }
    );
  });

  it("fetchUserData - throws on invalid schema", async () => {
    mockedFetch.mockResolvedValue({ invalid: true });

    await expect(fetchUserData(mockUserId)).rejects.toThrow(
      "Invalid user data received from backend"
    );
  });

  it("createUserData - posts to correct endpoint", async () => {
    mockedFetch.mockResolvedValue({ success: true });

    const res = await createUserData(mockUserId, mockPayload);
    expect(res).toEqual({ success: true });
    expect(mockedFetch).toHaveBeenCalledWith(
      `https://mock-api.com/user/data/create/${mockUserId}`,
      {
        method: "POST",
        credentials: "include",
        body: mockPayload,
      }
    );
  });

  it("updateUserDataType - sends PUT with correct data", async () => {
    mockedFetch.mockResolvedValue({ updated: true });

    const res = await updateUserDataType(mockUserId, mockUpdatePayload);
    expect(res).toEqual({ updated: true });
    expect(mockedFetch).toHaveBeenCalledWith(
      `https://mock-api.com/user/data/update/${mockUserId}`,
      {
        method: "PUT",
        credentials: "include",
        body: mockUpdatePayload,
      }
    );
  });

  it("deleteUserData - sends DELETE to correct endpoint", async () => {
    mockedFetch.mockResolvedValue({ deleted: true });

    const res = await deleteUserData(mockUserId);
    expect(res).toEqual({ deleted: true });
    expect(mockedFetch).toHaveBeenCalledWith(
      `https://mock-api.com/user/data/delete/${mockUserId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  });
});
