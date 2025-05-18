import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { loadConfig } from "../../configuration/ConfigLoader";
import { DevAppConfig } from "../../configuration/DevAppConfig";
import { ProdAppConfig } from "../../configuration/ProdAppConfig";

describe("loadConfig", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules(); // <-- use `vi` in Vitest, not `jest`
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("returns DevAppConfig in development", () => {
    process.env.NODE_ENV = "development";
    const config = loadConfig();
    expect(config).toBe(DevAppConfig);
  });

  it("returns ProdAppConfig in production", () => {
    process.env.NODE_ENV = "production";
    const config = loadConfig();
    expect(config).toBe(ProdAppConfig);
  });
});
