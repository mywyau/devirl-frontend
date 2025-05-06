// controllers/FrontendApiController.ts
import { ConfigLoader } from "@/configuration/ConfigLoader";

export class FrontendApiController {
  constructor(
    private readonly config = ConfigLoader,
    private readonly apiBasePath = "/"
  ) {}

  private get baseUrl(): string {
    return `${this.config.devIrlFrontend.baseUrl}${this.apiBasePath}`;
  }

  loginUrl(): string {
    return `${this.baseUrl}api/auth/login`;
  }

  logoutUrl(): string {
    return `${this.baseUrl}api/auth/logout`;
  }

  sessionUrl(): string {
    return `${this.baseUrl}api/auth/session`;
  }

  callbackUrl(): string {
    return `${this.baseUrl}api/auth/callback`;
  }

  async logoutRequest() {
    await fetch(this.logoutUrl(), { credentials: "include" });
    window.location.href = "/";
  }

  async loginRequest() {
    await fetch("/api/auth/logout", { credentials: "include" });
    window.location.href = "/";
  }
}
