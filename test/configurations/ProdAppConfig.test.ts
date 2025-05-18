// test/config/static-config.test.ts
import { describe, expect, it } from "vitest"; // or 'jest'
import { z } from "zod";
import { ProdAppConfig } from "../../configuration/ProdAppConfig";

const ProdAppConfigSchema = z.object({
  featuresSwitches: z.object({
    payments: z.boolean(),
    auth: z.boolean(),
  }),
  devIrlFrontend: z.object({
    host: z.string(),
    port: z.string(),
    baseUrl: z.string(),
  }),
  devQuestBackend: z.object({
    host: z.string(),
    port: z.string(),
    baseUrl: z.string(),
  }),
});

describe("ProdAppConfig", () => {
  it("should have valid structure", () => {
    expect(ProdAppConfig).toMatchObject({
      featuresSwitches: {
        payments: true,
        auth: true,
      },
      devIrlFrontend: {
        host: "",
        port: "",
        baseUrl: "https://devirl.com",
      },
      devQuestBackend: {
        host: "",
        port: "",
        baseUrl: "https://devirl.com/dev-quest",
      },
    });
  });

  it("should reject invalid config shape", () => {
    const invalidConfig = {
      featuresSwitches: {
        payments: "yes", // should be boolean
        auth: true,
      },
      devIrlFrontend: {
        host: "",
        port: "",
        baseUrl: "https://devirl.com",
      },
      devQuestBackend: {
        host: "",
        port: "",
        baseUrl: "https://devirl.com/dev-quest/",
      },
    };

    expect(() => ProdAppConfigSchema.parse(invalidConfig)).toThrow();
  });
});
