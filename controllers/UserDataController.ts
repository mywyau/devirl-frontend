// controllers/UserDataController.ts

import {
  createUserData,
  deleteUserData,
  fetchUserData,
  updateUserData,
  updateUserDataType,
} from "@/connectors/UserDataConnector";
import type {
  CreateUserData,
  UpdateUserData,
  UpdateUserType,
} from "@/types/schema/UserDataSchema";

export async function getUser(
  userId: string,
  headers: Record<string, string> | undefined
) {
  return await fetchUserData(userId, headers);
}

export async function createUser(userId: string, payload: CreateUserData) {
  return await createUserData(userId, payload);
}

export async function updateUser(userId: string, payload: UpdateUserData) {
  return await updateUserData(userId, payload);
}

export async function updateUserType(userId: string, payload: UpdateUserType) {
  return await updateUserDataType(userId, payload);
}

export async function deleteUser(userId: string) {
  return await deleteUserData(userId);
}
