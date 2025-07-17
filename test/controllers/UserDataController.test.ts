// tests/UserDataController.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as connector from "../../connectors/UserDataConnector";
import {
  createUser,
  deleteUser,
  getUser,
  registerUser,
  updateUser,
} from "../../controllers/UserDataController";

import {
  CreateUserData,
  UpdateUserData,
  UserType
} from "../../types/schema/UserDataSchema";

vi.mock("@/connectors/UserDataConnector");

const mockUserId = "auth0|123456";
const headers = { cookie: "mockCookie" };

const mockUser = {
  userId: mockUserId,
  email: "user@example.com",
  username: "testuser",
  firstName: "Test",
  lastName: "User",
  userType: "Dev" as UserType,
};

const createPayload: CreateUserData = {
  userId: mockUserId,
  email: "user@example.com",
  firstName: "Test",
  lastName: "User",
  userType: "Client",
};

const updatePayload: UpdateUserData = {
  email: "user@example.com",
  firstName: "Updated",
  lastName: "Name",
  userType: "Dev",
};

const registrationPayload: RegistrationPayload = {
  username: "testuser",
  firstName: "bob",
  lastName: "smith",
  userType: "Dev",
};

describe("UserDataController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUser should fetch user data", async () => {
    vi.spyOn(connector, "fetchUserData").mockResolvedValue(mockUser);
    const result = await getUser(mockUserId, headers);
    expect(result).toEqual(mockUser);
    expect(connector.fetchUserData).toHaveBeenCalledWith(mockUserId, headers);
  });

  it("createUser should create user data", async () => {
    vi.spyOn(connector, "createUserData").mockResolvedValue(mockUser);
    const result = await createUser(mockUserId, createPayload);
    expect(result).toEqual(mockUser);
    expect(connector.createUserData).toHaveBeenCalledWith(
      mockUserId,
      createPayload
    );
  });

  it("updateUser should update user data", async () => {
    vi.spyOn(connector, "updateUserData").mockResolvedValue({ success: true });
    const result = await updateUser(mockUserId, updatePayload);
    expect(result).toEqual({ success: true });
    expect(connector.updateUserData).toHaveBeenCalledWith(
      mockUserId,
      updatePayload
    );
  });

  it("registerUser should update the user type", async () => {
    vi.spyOn(connector, "registerUserRequest").mockResolvedValue({
      success: true,
    });
    const result = await registerUser(mockUserId, registrationPayload);
    expect(result).toEqual({ success: true });
    expect(connector.registerUserRequest).toHaveBeenCalledWith(
      mockUserId,
      registrationPayload
    );
  });

  it("deleteUser should delete user data", async () => {
    vi.spyOn(connector, "deleteUserData").mockResolvedValue({ success: true });
    const result = await deleteUser(mockUserId);
    expect(result).toEqual({ success: true });
    expect(connector.deleteUserData).toHaveBeenCalledWith(mockUserId);
  });
});
