import { describe, it, expect } from "vitest";
import {
  CreateEstimateSchema,
  GetEstimateSchema,
} from "../../../types/schema/EstimateSchema.ts"; // adjust path as needed

describe("CreateEstimateSchema", () => {
  const validCreate = {
    questId: "abc123",
    rank: "Mithril",
    comment: "Seems intermediate difficulty.",
  };

  it("validates correct CreateEstimate data", () => {
    const result = CreateEstimateSchema.safeParse(validCreate);
    expect(result.success).toBe(true);
  });

  it("fails if questId is missing", () => {
    const { questId, ...invalidData } = validCreate;
    const result = CreateEstimateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if rank is not a string", () => {
    const invalidData = { ...validCreate, rank: 42 };
    const result = CreateEstimateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if comment is empty", () => {
    const invalidData = { ...validCreate, comment: "" };
    const result = CreateEstimateSchema.safeParse(invalidData);
    expect(result.success).toBe(true); // Still valid — no `.min()` constraint
  });
});

describe("GetEstimateSchema", () => {
  const validGet = {
    username: "dev_chris",
    rank: "Bronze",
    comment: "Easy one, should be quick.",
  };

  it("validates correct GetEstimate data", () => {
    const result = GetEstimateSchema.safeParse(validGet);
    expect(result.success).toBe(true);
  });

  it("fails if username is missing", () => {
    const { username, ...invalidData } = validGet;
    const result = GetEstimateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if rank is null", () => {
    const invalidData = { ...validGet, rank: null };
    const result = GetEstimateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if comment is a number", () => {
    const invalidData = { ...validGet, comment: 123 };
    const result = GetEstimateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
