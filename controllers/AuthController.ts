// controllers/AuthController.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import { useFetch } from "nuxt/app";

const config = loadConfig();
const baseUrl = `${config.devIrlFrontend.baseUrl}/`;

export function loginUrl(): string {
  return `${baseUrl}api/auth/login`;
}

export function logoutUrl(): string {
  return `${baseUrl}api/auth/logout`;
}

export function callbackUrl(): string {
  return `${baseUrl}api/auth/callback`;
}

export async function logoutRequest() {
  return await useFetch(logoutUrl(), { credentials: "include" });
}
