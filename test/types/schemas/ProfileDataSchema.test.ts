import { describe, expect, it } from "vitest";
import {
    ProfileDataSchema,
    ProfileLanguageDataSchema,
    ProfileSkillDataSchema,
} from "../../../types/schema/ProfileDataSchema"; // adjust path as needed

describe("ProfileSkillDataSchema", () => {
  const validSkill = {
    skill: "Questing",
    skillLevel: 2,
    skillXp: 500,
  };

  it("validates a valid skill entry", () => {
    const result = ProfileSkillDataSchema.safeParse(validSkill);
    expect(result.success).toBe(true);
  });

  it("fails if skill is invalid", () => {
    const invalid = { ...validSkill, skill: "Cooking" };
    const result = ProfileSkillDataSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("fails if skillLevel is a string", () => {
    const invalid = { ...validSkill, skillLevel: "2" };
    const result = ProfileSkillDataSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("ProfileLanguageDataSchema", () => {
  const validLang = {
    language: "Scala",
    languageLevel: 3,
    languageXp: 1200,
  };

  it("validates a valid language entry", () => {
    const result = ProfileLanguageDataSchema.safeParse(validLang);
    expect(result.success).toBe(true);
  });

  it("fails if language is not in enum", () => {
    const invalid = { ...validLang, language: "Elixir" };
    const result = ProfileLanguageDataSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("fails if languageXp is missing", () => {
    const { languageXp, ...invalid } = validLang;
    const result = ProfileLanguageDataSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("ProfileDataSchema", () => {
  const validProfile = {
    devId: "dev-123",
    username: "coder_may",
    skillData: [
      { skill: "Testing", skillLevel: 1, skillXp: 100 },
      { skill: "Estimating", skillLevel: 2, skillXp: 200 },
    ],
    languageData: [
      { language: "TypeScript", languageLevel: 3, languageXp: 900 },
      { language: "Scala", languageLevel: 4, languageXp: 1500 },
    ],
  };

  it("validates a complete valid profile", () => {
    const result = ProfileDataSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it("allows username to be null", () => {
    const profile = { ...validProfile, username: null };
    const result = ProfileDataSchema.safeParse(profile);
    expect(result.success).toBe(true);
  });

  it("fails if skillData includes an invalid skill", () => {
    const invalidProfile = {
      ...validProfile,
      skillData: [{ skill: "Cooking", skillLevel: 1, skillXp: 100 }],
    };
    const result = ProfileDataSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
  });

  it("fails if languageData includes an invalid entry", () => {
    const invalidProfile = {
      ...validProfile,
      languageData: [{ language: "Haskell", languageLevel: 2, languageXp: 300 }],
    };
    const result = ProfileDataSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
  });

  it("fails if devId is missing", () => {
    const { devId, ...invalid } = validProfile;
    const result = ProfileDataSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
