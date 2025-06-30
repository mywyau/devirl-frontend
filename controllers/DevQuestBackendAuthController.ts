import {
  DevQuestBackendAuthConnector,
  type StoreSessionResponse,
} from "@/connectors/DevQuestBackendAuthConnector";

export class DevQuestBackendAuthController {
  private readonly connector: DevQuestBackendAuthConnector;

  constructor(connector = new DevQuestBackendAuthConnector()) {
    this.connector = connector;
    console.info(`[DevQuestBackendAuthController] Initialized.`);
  }

  async storeCookieSessionInRedis(
    userId: string
  ): Promise<StoreSessionResponse> {
    console.info(`[Controller] Storing session for user: ${userId}`);
    try {
      const response = await this.connector.storeSession(userId);
      console.info(`[Controller] Session stored for user: ${userId}`, response);
      return response;
    } catch (error: any) {
      console.error(
        `[Controller] Failed to store session for user: ${userId}`,
        error
      );
      throw createReadableError(error);
    }
  }

  async storeCookieSessionInRedisServerToServer(
    userId: string,
    cookieHeader: string
  ): Promise<StoreSessionResponse> {
    console.info(
      `[Controller] Storing (server2server) session for user: ${userId}`
    );
    try {
      const response = await this.connector.storeSession(userId, cookieHeader);
      console.info(`[Controller] Session stored for user: ${userId}`, response);
      return response;
    } catch (error: any) {
      console.error(
        `[Controller] Failed to store session (s2s) for user: ${userId}`,
        error
      );
      throw createReadableError(error);
    }
  }

  async deleteCookieSessionInRedisServerToServer(
    userId: string,
    cookieHeader: string
  ): Promise<StoreSessionResponse> {
    console.info(`[Controller] Deleting session (s2s) for user: ${userId}`);
    try {
      const response = await this.connector.deleteSession(userId, cookieHeader);
      console.info(
        `[Controller] Session deleted for user: ${userId}`,
        response
      );
      return response;
    } catch (error: any) {
      console.error(
        `[Controller] Failed to delete session (s2s) for user: ${userId}`,
        error
      );
      throw createReadableError(error);
    }
  }
}

function createReadableError(error: any): Error {
  if (error?.data?.message) return new Error(error.data.message);
  if (error?.message) return new Error(error.message);
  return new Error("Unknown error occurred while storing session");
}
