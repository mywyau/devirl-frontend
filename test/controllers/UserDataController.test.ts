// import { describe, it, expect, vi, beforeEach } from "vitest";
// import {
//   getUser,
//   createUser,
//   updateUserType,
//   deleteUser,
// } from "../../controllers/UserDataController";
// import * as userDataConnector from "../../connectors/UserDataConnector";
// // import type { CreateUserPayload, UpdateUserTypePayload } from "../../types/users";

// // Mock the connector functions
// vi.mock("@/connectors/UserDataConnector", () => ({
//   fetchUserData: vi.fn(),
//   createUserData: vi.fn(),
//   updateUserDataType: vi.fn(),
//   deleteUserData: vi.fn(),
// }));

// describe("UserDataController", () => {
//   const fetchUserData = userDataConnector.fetchUserData as ReturnType<typeof vi.fn>;
//   const createUserData = userDataConnector.createUserData as ReturnType<typeof vi.fn>;
//   const updateUserDataType = userDataConnector.updateUserDataType as ReturnType<typeof vi.fn>;
//   const deleteUserData = userDataConnector.deleteUserData as ReturnType<typeof vi.fn>;

//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it("getUser delegates to fetchUserData", async () => {
//     fetchUserData.mockResolvedValue({ userId: "123" });

//     const result = await getUser("123");

//     expect(fetchUserData).toHaveBeenCalledWith("123");
//     expect(result).toEqual({ userId: "123" });
//   });

//   it("createUser delegates to createUserData", async () => {
//     const payload: CreateUserPayload = {
//       firstName: "John",
//       lastName: "Doe",
//       email: "john@example.com",
//       userType: "Client",
//     };

//     createUserData.mockResolvedValue({ success: true });

//     const result = await createUser("user123", payload);

//     expect(createUserData).toHaveBeenCalledWith("user123", payload);
//     expect(result).toEqual({ success: true });
//   });

//   it("updateUserType delegates to updateUserDataType", async () => {
//     const payload: UpdateUserTypePayload = {
//       userType: "Dev",
//     };

//     updateUserDataType.mockResolvedValue({ updated: true });

//     const result = await updateUserType("user456", payload);

//     expect(updateUserDataType).toHaveBeenCalledWith("user456", payload);
//     expect(result).toEqual({ updated: true });
//   });

//   it("deleteUser delegates to deleteUserData", async () => {
//     deleteUserData.mockResolvedValue({ deleted: true });

//     const result = await deleteUser("user789");

//     expect(deleteUserData).toHaveBeenCalledWith("user789");
//     expect(result).toEqual({ deleted: true });
//   });
// });


// tests/UserDataController.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as connector from "../../connectors/UserDataConnector";
import {
  getUser,
  createUser,
  updateUser,
  updateUserType,
  deleteUser,
} from "../../controllers/UserDataController";

import {
  CreateUserData,
  UpdateUserData,
  UpdateUserType,
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

const updateTypePayload: UpdateUserType = {
  username: "testuser",
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
    expect(connector.createUserData).toHaveBeenCalledWith(mockUserId, createPayload);
  });

  it("updateUser should update user data", async () => {
    vi.spyOn(connector, "updateUserData").mockResolvedValue({ success: true });
    const result = await updateUser(mockUserId, updatePayload);
    expect(result).toEqual({ success: true });
    expect(connector.updateUserData).toHaveBeenCalledWith(mockUserId, updatePayload);
  });

  it("updateUserType should update the user type", async () => {
    vi.spyOn(connector, "updateUserDataType").mockResolvedValue({ success: true });
    const result = await updateUserType(mockUserId, updateTypePayload);
    expect(result).toEqual({ success: true });
    expect(connector.updateUserDataType).toHaveBeenCalledWith(mockUserId, updateTypePayload);
  });

  it("deleteUser should delete user data", async () => {
    vi.spyOn(connector, "deleteUserData").mockResolvedValue({ success: true });
    const result = await deleteUser(mockUserId);
    expect(result).toEqual({ success: true });
    expect(connector.deleteUserData).toHaveBeenCalledWith(mockUserId);
  });
});
