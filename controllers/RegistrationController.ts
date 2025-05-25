// controllers/UserDataController.ts
import { $fetch } from "ofetch";
import { loadConfig } from "@/configuration/ConfigLoader";
import { UserDataSchema } from "@/types/schema/UserDataSchema";
import type { UserData } from "@/types/schema/UserDataSchema";

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

const getUserDataUrl = (userId: string) =>
  `${baseUrl}registration/data/${encodeURIComponent(userId)}`;

const createUserDataUrl = (userId: string) =>
  `${baseUrl}registration/data/create/${encodeURIComponent(userId)}`;

const updateUserTypeUrl = (userId: string) =>
  `${baseUrl}registration/data/update/${encodeURIComponent(userId)}`;

const deleteUserDataUrl = (userId: string) =>
  `${baseUrl}registration/data/delete/${encodeURIComponent(userId)}`;

export async function getUser(userId: string) {
  const res = await $fetch(getUserDataUrl(userId), {
    credentials: "include",
  });

  const result = UserDataSchema.safeParse(res);

  if (!result.success) {
    console.error("[getUser] Invalid user data", result.error);
    throw new Error("Invalid user data received from backend");
  }

  return result.data;
}

export async function createUser(userId: string, payload: UserData) {
  const url = createUserDataUrl(userId);
  console.log(`[createUser] POST to: ${url}`);
  console.log("[createUser] Payload:", payload);

  try {
    const res = await $fetch(url, {
      method: "POST",
      credentials: "include",
      body: payload,
    });

    console.log("[createUser] Response:", res);
    return res;
  } catch (err) {
    console.error("[createUser] Error:", err);
    throw err;
  }
}

export async function createUserServerToServer(
  userId: string,
  cookieHeader: string,
  payload: UserData
) {
  const url = createUserDataUrl(userId);
  console.log(`[createUser] POST to: ${url}`);
  console.log("[createUser] Payload:", payload);

  try {
    const res = await $fetch(url, {
      method: "POST",
      headers: {
        cookie: cookieHeader, // Manually inject the cookie header for server to server
      },
      body: payload,
    });

    console.log("[createUserServerToServer] Response:", res);
    return res;
  } catch (err) {
    console.error("[createUserServerToServer] Error:", err);
    throw err;
  }
}

export async function updateUserType(
  userId: string,
  payload: UpdateUserTypePayload
) {
  return await $fetch(updateUserUrl(userId), {
    method: "PUT",
    credentials: "include",
    body: payload,
  });
}

export async function deleteUser(userId: string) {
  return await $fetch(deleteUserUrl(userId), {
    method: "DELETE",
    credentials: "include",
  });
}
