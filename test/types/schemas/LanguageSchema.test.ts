import { describe, expect, it } from "vitest";
import {
  LanguageDataSchema,
  LanguageSchema,
} from "../../../types/schema/LangaugeSchema"; // adjust path as needed

describe("LanguageSchema", () => {
  const validLanguages = [
    "Python",
    "Java",
    "Scala",
    "Rust",
    "TypeScript",
    "Sql",
  ];

  validLanguages.forEach((lang) => {
    it(`accepts valid language: ${lang}`, () => {
      const result = LanguageSchema.safeParse(lang);
      expect(result.success).toBe(true);
    });
  });

  it("rejects invalid language", () => {
    const result = LanguageSchema.safeParse("Haskell");
    expect(result.success).toBe(false);
  });

  it("rejects non-string input", () => {
    const result = LanguageSchema.safeParse(123);
    expect(result.success).toBe(false);
  });
});

describe("LanguageDataSchema", () => {
  const validData = {
    devId: "dev-abc-123",
    username: "dev_jane",
    language: "Scala",
    level: 3,
    xp: 1200,
  };

  it("validates correct LanguageData object", () => {
    const result = LanguageDataSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails if devId is missing", () => {
    const { devId, ...invalidData } = validData;
    const result = LanguageDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if language is not in enum", () => {
    const invalidData = { ...validData, language: "Haskell" };
    const result = LanguageDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if level is a string", () => {
    const invalidData = { ...validData, level: "three" };
    const result = LanguageDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if xp is missing", () => {
    const { xp, ...invalidData } = validData;
    const result = LanguageDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if xp is negative (if validation is added)", () => {
    const invalidData = { ...validData, xp: -100 };
    const result = LanguageDataSchema.safeParse(invalidData);
    // Currently this would pass unless you add `.nonnegative()`
    expect(result.success).toBe(true); // update this to false if you add stricter validation
  });
});
