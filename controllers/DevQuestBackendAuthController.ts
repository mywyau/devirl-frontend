// controllers/AuthController.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch"; // ofetch is what Nuxt uses under the hood

interface StoreSessionResponse {
  success: boolean;
  message?: string;
}

export class DevQuestBackendAuthController {
  private readonly baseUrl: string;

  constructor(config = loadConfig(), private readonly apiBasePath = "/") {
    this.baseUrl = `${config.devQuestBackend.baseUrl}${apiBasePath}`;
    console.info(`[DevQuestBackendAuthController] Initialized with base URL: ${this.baseUrl}`);
  }

  private storeSessionUrl(userId: string): string {
    const url = `${this.baseUrl}auth/session/${encodeURIComponent(userId)}`;
    console.debug(`[DevQuestBackendAuthController] Computed storeSessionUrl: ${url}`);
    return url;
  }

  private deleteSessionUrl(userId: string): string {
    const url = `${this.baseUrl}auth/session/delete/${encodeURIComponent(
      userId
    )}`;
    console.debug(`[DevQuestBackendAuthController] Computed storeSessionUrl: ${url}`);
    return url;
  }

  async storeCookieSessionInRedis(
    userId: string
  ): Promise<StoreSessionResponse> {
    const url = this.storeSessionUrl(userId);
    console.info(
      `[DevQuestBackendAuthController] Storing session for user: ${userId} at ${url}`
    );

    try {
      const response = await $fetch<StoreSessionResponse>(url, {
        method: "POST",
        credentials: "include",
      });

      console.info(
        `[DevQuestBackendAuthController] Session stored successfully for user: ${userId}`,
        response
      );
      return response;
    } catch (error: any) {
      console.error(
        `[DevQuestBackendAuthController] Failed to store session for user: ${userId}`,
        error
      );
      throw createReadableError(error);
    }
  }

  async storeCookieSessionInRedisServerToServer(
    userId: string,
    cookieHeader: string
  ): Promise<StoreSessionResponse> {
    const url = this.storeSessionUrl(userId);
    console.info(
      `[DevQuestBackendAuthController] Storing session for user: ${userId} at ${url}`
    );

    try {
      const response = await $fetch<StoreSessionResponse>(url, {
        method: "POST",
        headers: {
          cookie: cookieHeader, // Manually inject the cookie header for server to server
        },
      });

      console.info(
        `[DevQuestBackendAuthController] Session stored successfully for user: ${userId}`,
        response
      );
      return response;
    } catch (error: any) {
      console.error(
        `[DevQuestBackendAuthController] Failed to store session for user: ${userId}`,
        error
      );
      throw createReadableError(error);
    }
  }

  async deleteCookieSessionInRedisServerToServer(
    userId: string,
    cookieHeader: string
  ): Promise<StoreSessionResponse> {
    const url = this.storeSessionUrl(userId);
    console.info(
      `[DevQuestBackendAuthController] Storing session for user: ${userId} at ${url}`
    );

    try {
      const response = await $fetch<StoreSessionResponse>(url, {
        method: "POST",
        headers: {
          cookie: cookieHeader, // Manually inject the cookie header for server to server
        },
      });

      console.info(
        `[DevQuestBackendAuthController] Session stored successfully for user: ${userId}`,
        response
      );
      return response;
    } catch (error: any) {
      console.error(
        `[DevQuestBackendAuthController] Failed to store session for user: ${userId}`,
        error
      );
      throw createReadableError(error);
    }
  }
}

function createReadableError(error: any): Error {
  if (error?.data?.message) {
    console.warn(
      `[DevQuestBackendAuthController] Backend error message: ${error.data.message}`
    );
    return new Error(error.data.message);
  }

  if (error?.message) {
    console.warn(`[DevQuestBackendAuthController] Generic error message: ${error.message}`);
    return new Error(error.message);
  }

  console.warn(`[DevQuestBackendAuthController] Unknown error`, error);
  return new Error("Unknown error occurred while storing session");
}
