// controllers/UserDataController.ts

import {
  fetchUserData,
  createUserData,
  updateUserDataType,
  deleteUserData,
} from "@/connectors/UserDataConnector";
import type { CreateUserPayload, UpdateUserTypePayload } from "@/types/users";

/**
 * Controller wrapper around user data fetch
 */
export async function getUser(userId: string) {
  // You can add controller-level logging or error handling here if needed
  return await fetchUserData(userId)
}

export async function createUser(userId: string, payload: CreateUserPayload) {
  // Controller can validate inputs or log the call
  return await createUserData(userId, payload);
}

export async function updateUserType(userId: string, payload: UpdateUserTypePayload) {
  return await updateUserDataType(userId, payload);
}

export async function deleteUser(userId: string) {
  return await deleteUserData(userId);
}
