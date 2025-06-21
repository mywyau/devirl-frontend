import { describe, it, expect, vi, beforeEach } from "vitest";

// ✅ Mock BEFORE importing the module under test
vi.mock("@/configuration/ConfigLoader", () => ({
  loadConfig: () => ({
    devQuestBackend: { baseUrl: "https://mock-backend.com" },
  }),
}));

vi.mock("ofetch", async () => {
  const actual = await vi.importActual("ofetch");
  return {
    ...actual,
    $fetch: vi.fn(),
  };
});

import { $fetch } from "ofetch";
import {
  fetchUserData,
  createUserData,
  updateUserDataType,
  deleteUserData,
} from "../../connectors/UserDataConnector";

describe("UserDataConnector", () => {

  const userId = "test-user";

  const validResponse = {
    userId: userId,
    email: "alice_smith@gmail.com",
    username: "goku",
    firstName: "Alice",
    lastName: "Smith",
    userType: "Dev",
  };


  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchUserData - success", async () => {
    ($fetch as any).mockResolvedValue(validResponse);

    const result = await fetchUserData(userId);
    expect(result).toEqual(validResponse);

    expect($fetch).toHaveBeenCalledWith(
      `https://mock-backend.com/user/data/${userId}`,
      { credentials: "include" }
    );
  });

  it("fetchUserData - fails with invalid schema", async () => {
    ($fetch as any).mockResolvedValue({ bad: "data" });

    await expect(fetchUserData(userId)).rejects.toThrow(
      "Invalid user data received from backend"
    );
  });

  it("createUserData - success", async () => {
    const payload = { name: "Alice", role: "Dev" };
    const mockResponse = { code: "201", message: "Created" };

    ($fetch as any).mockResolvedValue(mockResponse);

    const result = await createUserData(userId, payload);
    expect(result).toEqual(mockResponse);

    expect($fetch).toHaveBeenCalledWith(
      `https://mock-backend.com/user/data/create/${userId}`,
      {
        method: "POST",
        credentials: "include",
        body: payload,
      }
    );
  });

  it("updateUserDataType - success", async () => {
    const payload = { userType: "Client" };
    const mockResponse = { code: "200", message: "Updated" };

    ($fetch as any).mockResolvedValue(mockResponse);

    const result = await updateUserDataType(userId, payload);
    expect(result).toEqual(mockResponse);

    expect($fetch).toHaveBeenCalledWith(
      `https://mock-backend.com/user/data/update/${userId}`,
      {
        method: "PUT",
        credentials: "include",
        body: payload,
      }
    );
  });

  it("deleteUserData - success", async () => {
    const mockResponse = { code: "204", message: "Deleted" };

    ($fetch as any).mockResolvedValue(mockResponse);

    const result = await deleteUserData(userId);
    expect(result).toEqual(mockResponse);

    expect($fetch).toHaveBeenCalledWith(
      `https://mock-backend.com/user/data/delete/${userId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  });
});
