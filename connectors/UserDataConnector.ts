// ./connectors/UserDataConnector.ts

import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch";
import { GetUserDataSchema } from "@/types/schema/UserDataSchema";
// import type { CreateUserPayload, UpdateUserTypePayload } from "@/types/users";
import type { CreateUserData, UpdateUserType, UpdateUserData } from "@/types/schema/UserDataSchema";
import { CreateUserDataSchema, UpdateUserTypeSchema, UpdateUserDataSchema } from "@/types/schema/UserDataSchema";

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const endpoints = {
  get: (id: string) => `${baseUrl}user/data/${encodeURIComponent(id)}`,
  create: (id: string) =>
    `${baseUrl}user/data/create/${encodeURIComponent(id)}`,
  update: (id: string) =>
    `${baseUrl}user/data/update/${encodeURIComponent(id)}`,
  delete: (id: string) =>
    `${baseUrl}user/data/delete/${encodeURIComponent(id)}`,
};

export async function fetchUserData(userId: string) {
  const res = await $fetch(endpoints.get(userId), {
    credentials: "include",
  });

  const parsed = GetUserDataSchema.safeParse(res);
  if (!parsed.success) {
    console.error("[fetchUserData] Invalid user data", parsed.error);
    throw new Error("Invalid user data received from backend");
  }

  return parsed.data;
}

export async function createUserData(
  userId: string,
  payload: CreateUserData
) {
  return await $fetch(endpoints.create(userId), {
    method: "POST",
    credentials: "include",
    body: payload,
  });
}

export async function updateUserData(
  userId: string,
  payload: UpdateUserData
) {
  return await $fetch(endpoints.update(userId), {
    method: "PUT",
    credentials: "include",
    body: payload,
  });
}

export async function updateUserDataType(
  userId: string,
  payload: UpdateUserType
) {
  return await $fetch(endpoints.update(userId), {
    method: "PUT",
    credentials: "include",
    body: payload,
  });
}

export async function deleteUserData(userId: string) {
  return await $fetch(endpoints.delete(userId), {
    method: "DELETE",
    credentials: "include",
  });
}
