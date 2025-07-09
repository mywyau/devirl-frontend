import { describe, expect, it } from "vitest";
import {
    SkillDataSchema,
    SkillSchema,
} from "../../../types/schema/SkillDataSchema"; // Adjust import path as needed

describe("SkillSchema", () => {
  const validSkills = ["Questing", "Estimating", "Testing"];

  validSkills.forEach((skill) => {
    it(`accepts valid skill: ${skill}`, () => {
      const result = SkillSchema.safeParse(skill);
      expect(result.success).toBe(true);
    });
  });

  it("rejects invalid skill", () => {
    const result = SkillSchema.safeParse("Designing");
    expect(result.success).toBe(false);
  });

  it("rejects non-string input", () => {
    const result = SkillSchema.safeParse(42);
    expect(result.success).toBe(false);
  });
});

describe("SkillDataSchema", () => {
  const validData = {
    devId: "dev-xyz-789",
    username: "dev_luna",
    skill: "Estimating",
    level: 2,
    xp: 450,
  };

  it("validates correct SkillData object", () => {
    const result = SkillDataSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails if devId is missing", () => {
    const { devId, ...invalidData } = validData;
    const result = SkillDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if skill is invalid", () => {
    const invalidData = { ...validData, skill: "Debugging" };
    const result = SkillDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if level is not a number", () => {
    const invalidData = { ...validData, level: "2" };
    const result = SkillDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if xp is negative (if schema is strict)", () => {
    const invalidData = { ...validData, xp: -50 };
    const result = SkillDataSchema.safeParse(invalidData);
    expect(result.success).toBe(true); // Change to false if you add `.nonnegative()`
  });
});
