// ./connectors/UserDataConnector.ts

import { loadConfig } from "@/configuration/ConfigLoader";
import type {
  CreateUserData,
  UpdateUserData,
  RegistrationPayload,
} from "@/types/schema/UserDataSchema";
import { GetUserDataSchema } from "@/types/schema/UserDataSchema";
import { $fetch } from "ofetch";

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

export async function fetchUserData(
  userId: string,
  headers: Record<string, string> | undefined
) {
  const res = await $fetch(endpoints.get(userId), {
    credentials: "include",
    headers, // forward cookies
  });

  const parsed = GetUserDataSchema.safeParse(res);
  if (!parsed.success) {
    console.error("[fetchUserData] Invalid user data", parsed.error);
    throw new Error("Invalid user data received from backend");
  }

  return parsed.data;
}

export async function createUserData(userId: string, payload: CreateUserData) {
  return await $fetch(endpoints.create(userId), {
    method: "POST",
    credentials: "include",
    body: payload,
  });
}

export async function updateUserData(userId: string, payload: UpdateUserData) {
  return await $fetch(endpoints.update(userId), {
    method: "PUT",
    credentials: "include",
    body: payload,
  });
}

export async function registerUserRequest(
  userId: string,
  payload: RegistrationPayload
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
