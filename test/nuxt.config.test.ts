import { describe, it, expect, vi } from "vitest";

// Directly import your config
import config from "@/nuxt.config";

describe("Nuxt Config", () => {
  it("has strict TypeScript enabled", () => {
    expect(config.typescript?.strict).toBe(true);
    expect(config.typescript?.shim).toBe(false);
  });

  it("has Tailwind CSS module registered", () => {
    expect(config.modules).toContain("@nuxtjs/tailwindcss");
  });

  it("includes tailwind.css in global CSS", () => {
    expect(config.css).toContain("@/assets/css/tailwind.css");
  });

  it("sets dev server port to 3000", () => {
    expect(config.devServer?.port).toBe(3000);
  });

  it("includes expected public runtime config", () => { 

    // TODO remove test or fix these go to fallback
    expect(config.runtimeConfig?.public?.apiBase).toBeDefined();
    expect(config.runtimeConfig?.public?.auth0Domain).toBeDefined();
    expect(config.runtimeConfig?.public?.auth0ClientId).toBeDefined();
    expect(config.runtimeConfig?.public?.auth0Audience).toBeDefined();
    expect(config.runtimeConfig?.public?.auth0CallbackUrl).toBeDefined();
  });

  it("includes private runtime config", () => {
    // TODO remove test or fix these go to fallback
    expect(config.runtimeConfig?.auth0ClientSecret).toBeDefined();
  });
});
