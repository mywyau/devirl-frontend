// controllers/UserDataController.ts

import {
  fetchUserData,
  createUserData,
  updateUserData,
  updateUserDataType,
  deleteUserData,
} from "@/connectors/UserDataConnector";
import type { CreateUserData, UpdateUserType, UpdateUserData } from "@/types/schema/UserDataSchema";
import { CreateUserDataSchema, UpdateUserTypeSchema, UpdateUserDataSchema } from "@/types/schema/UserDataSchema";


export async function getUser(userId: string) {
  return await fetchUserData(userId)
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
