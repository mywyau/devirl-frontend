import { $fetch } from "ofetch";
import { loadConfig } from "@/configuration/ConfigLoader";

export interface StoreSessionResponse {
  success: boolean;
  message?: string;
}

export class DevQuestBackendAuthConnector {
  private readonly baseUrl: string;

  constructor(config = loadConfig(), private readonly apiBasePath = "/") {
    this.baseUrl = `${config.devQuestBackend.baseUrl}${apiBasePath}`;
  }

  private storeSessionUrl(userId: string): string {
    return `${this.baseUrl}auth/session/${encodeURIComponent(userId)}`;
  }

  private deleteSessionUrl(userId: string): string {
    return `${this.baseUrl}auth/session/delete/${encodeURIComponent(userId)}`;
  }

  storeSession(userId: string, cookieHeader?: string): Promise<StoreSessionResponse> {
    return $fetch<StoreSessionResponse>(this.storeSessionUrl(userId), {
      method: "POST",
      ...(cookieHeader
        ? { headers: { cookie: cookieHeader } }
        : { credentials: "include" }),
    });
  }

  deleteSession(userId: string, cookieHeader: string): Promise<StoreSessionResponse> {
    return $fetch<StoreSessionResponse>(this.deleteSessionUrl(userId), {
      method: "POST",
      headers: {
        cookie: cookieHeader,
      },
    });
  }
}
