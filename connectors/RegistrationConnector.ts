// ./controllers/RegistrationController.ts (or connectors/registration.ts)

import { loadConfig } from "@/configuration/ConfigLoader";
import {
  type UpdateUserType,
  type UserData
} from "@/types/schema/UserDataSchema";
import { $fetch } from "ofetch";

const config = loadConfig();
const baseUrl = config.devQuestBackend.baseUrl;

const registrationUrl = (path: string, userId: string) =>
  `${baseUrl}/registration/${path}/${encodeURIComponent(userId)}`;

export async function createUserNuxtServerToScalaServer(
  userId: string,
  cookieHeader: string,
  payload: UserData
) {
  const url = registrationUrl("data/create", userId);
  return await $fetch(url, {
    method: "POST",
    headers: {
      cookie: cookieHeader,
    },
    body: payload,
  });
}

export async function updateUserType(userId: string, payload: UpdateUserType) {
  const url = registrationUrl("update/user/type", userId);
  return await $fetch(url, {
    method: "PUT",
    credentials: "include",
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

