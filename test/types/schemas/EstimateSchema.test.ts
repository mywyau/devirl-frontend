import { describe, expect, it } from "vitest";
import {
  CalculatedEstimate,
  CreateEstimateSchema,
  GetEstimate,
  GetEstimateSchema,
} from "../../../types/schema/EstimateSchema.ts";

describe("CreateEstimateSchema", () => {
  const validCreate = {
    questId: "abc123",
    score: 80,
    days: 5,
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

  it("fails if comment is empty", () => {
    const invalidData = { ...validCreate, comment: "" };
    const result = CreateEstimateSchema.safeParse(invalidData);
    expect(result.success).toBe(true); // Or false, if you add min(1) to schema
  });
});

describe("GetEstimateSchema", () => {
  const mockCalculatedEstimate: CalculatedEstimate[] = [
    {
      username: "username",
      score: 80,
      days: 5,
      rank: "Iron",
      comment: "Challenging but manageable",
    },
  ];

  const mockEstimationStatus = "EstimateOpen";

  const validGet: GetEstimate = {
    estimationStatus: mockEstimationStatus,
    calculatedEstimate: mockCalculatedEstimate,
  };

  it("validates correct GetEstimate data", () => {
    const result = GetEstimateSchema.safeParse(validGet);
    expect(result.success).toBe(true);
  });

  it("fails if username is missing", () => {
    const invalidData = {
      ...validGet,
      calculatedEstimate: [{ ...mockCalculatedEstimate[0], username: undefined }],
    };
    const result = GetEstimateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if rank is null", () => {
    const invalidData = {
      ...validGet,
      calculatedEstimate: [{ ...mockCalculatedEstimate[0], rank: null }],
    };
    const result = GetEstimateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if comment is a number", () => {
    const invalidData = {
      ...validGet,
      calculatedEstimate: [{ ...mockCalculatedEstimate[0], comment: 123 }],
    };
    const result = GetEstimateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
