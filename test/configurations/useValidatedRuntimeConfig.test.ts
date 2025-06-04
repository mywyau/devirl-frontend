// test/configuration/useValidatedRuntimeConfig.test.ts
import { describe, it, expect, vi } from "vitest";
import { useValidatedRuntimeConfig } from "../../configuration/useValidatedRuntimeConfig";
import { useRuntimeConfig } from "nuxt/app";

vi.mock("nuxt/app", () => ({
  useRuntimeConfig: vi.fn(),
}));

describe("useValidatedRuntimeConfig", () => {
  it("parses and returns a valid public runtime config", () => {
    const validConfig = {
      sessionSecret: "",
      devIrlFrontendBaseUrl: "",
      apiBase: "http://localhost:8080",
      auth0Domain: "example.auth0.com",
      auth0ClientId: "client_123",
      auth0Audience: "https://api.example.com",
      auth0CallbackUrl: "http://localhost:3000/callback",
    };

    (useRuntimeConfig as any).mockReturnValue({
      public: validConfig,
    });

    const result = useValidatedRuntimeConfig();
    expect(result).toEqual(validConfig);
  });

  it("throws an error if a required field is missing", () => {
    const invalidConfig = {
      // missing `auth0ClientId`
      apiBase: "http://localhost:8080",
      auth0Domain: "example.auth0.com",
      auth0Audience: "https://api.example.com",
      auth0CallbackUrl: "http://localhost:3000/callback",
    };

    (useRuntimeConfig as any).mockReturnValue({
      public: invalidConfig,
    });

    expect(() => useValidatedRuntimeConfig()).toThrow();
  });

  it("throws an error if a field has the wrong type", () => {
    const invalidConfig = {
      sessionSecret: "",
      devIrlFrontendBaseUrl: "",
      apiBase: 123, // should be string
      auth0Domain: "example.auth0.com",
      auth0ClientId: "client_123",
      auth0Audience: "https://api.example.com",
      auth0CallbackUrl: "http://localhost:3000/callback",
    };

    (useRuntimeConfig as any).mockReturnValue({
      public: invalidConfig,
    });

    expect(() => useValidatedRuntimeConfig()).toThrow();
  });
});
