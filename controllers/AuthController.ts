// controllers/AuthController.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import { useFetch } from "nuxt/app";

type SessionUser = {
  name: string;
  email: string;
  sub: string;
};

export class AuthController {
  constructor(
    private readonly config = loadConfig(),
    private readonly apiBasePath = "/"
  ) {}

  private get baseUrl(): string {
    return `${this.config.devIrlFrontend.baseUrl}${this.apiBasePath}`;
  }

  loginUrl(): string {
    return `${this.baseUrl}api/auth/login`;
  }

  logoutUrl(): string {
    // console.log(`${this.baseUrl}api/auth/logout`);
    return `${this.baseUrl}api/auth/logout`;
  }

  sessionUrl(): string {
    return `${this.baseUrl}api/auth/session`;
  }

  callbackUrl(): string {
    return `${this.baseUrl}api/auth/callback`;
  }

  async sessionRequest() {
    return await useFetch<SessionUser | null>("/api/auth/session", {
      credentials: "include",
    });
  }

  async logoutRequest() {
    return await useFetch(this.logoutUrl(), { credentials: "include" });
  }

  async loginRequest() {
    // console.log(`${this.baseUrl}auth/session/${user.value.sub}`);
    await fetch(`${this.baseUrl}auth/session/${user.value.sub}`, {
      method: "POST",
      credentials: "include",
    });
  }
}
