import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUser,
  createUser,
  updateUserType,
  deleteUser,
} from "@/controllers/UserDataController";
import * as userDataConnector from "@/connectors/UserDataConnector";
import type { CreateUserPayload, UpdateUserTypePayload } from "@/types/users";

// Mock the connector functions
vi.mock("@/connectors/userDataConnector", () => ({
  fetchUserData: vi.fn(),
  createUserData: vi.fn(),
  updateUserDataType: vi.fn(),
  deleteUserData: vi.fn(),
}));

describe("UserDataController", () => {
  const fetchUserData = userDataConnector.fetchUserData as ReturnType<typeof vi.fn>;
  const createUserData = userDataConnector.createUserData as ReturnType<typeof vi.fn>;
  const updateUserDataType = userDataConnector.updateUserDataType as ReturnType<typeof vi.fn>;
  const deleteUserData = userDataConnector.deleteUserData as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUser delegates to fetchUserData", async () => {
    fetchUserData.mockResolvedValue({ userId: "123" });

    const result = await getUser("123");

    expect(fetchUserData).toHaveBeenCalledWith("123");
    expect(result).toEqual({ userId: "123" });
  });

  it("createUser delegates to createUserData", async () => {
    const payload: CreateUserPayload = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      userType: "Client",
    };

    createUserData.mockResolvedValue({ success: true });

    const result = await createUser("user123", payload);

    expect(createUserData).toHaveBeenCalledWith("user123", payload);
    expect(result).toEqual({ success: true });
  });

  it("updateUserType delegates to updateUserDataType", async () => {
    const payload: UpdateUserTypePayload = {
      userType: "Dev",
    };

    updateUserDataType.mockResolvedValue({ updated: true });

    const result = await updateUserType("user456", payload);

    expect(updateUserDataType).toHaveBeenCalledWith("user456", payload);
    expect(result).toEqual({ updated: true });
  });

  it("deleteUser delegates to deleteUserData", async () => {
    deleteUserData.mockResolvedValue({ deleted: true });

    const result = await deleteUser("user789");

    expect(deleteUserData).toHaveBeenCalledWith("user789");
    expect(result).toEqual({ deleted: true });
  });
});
