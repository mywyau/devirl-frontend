import { describe, expect, it } from "vitest";
import {
    CreatedResponseSchema,
    DeleteResponseSchema,
    GetResponseSchema,
    UpdateResponseSchema,
} from "../../../types/schema/ApiResponses";

const validData = {
  code: "200",
  message: "OK",
};

const invalidData = {
  code: 200, // should be string
  message: null, // should be string
};

describe("Response Schemas", () => {
  it("CreatedResponseSchema should validate correct data", () => {
    const result = CreatedResponseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("CreatedResponseSchema should fail on invalid data", () => {
    const result = CreatedResponseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("DeleteResponseSchema should validate correct data", () => {
    const result = DeleteResponseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("DeleteResponseSchema should fail on invalid data", () => {
    const result = DeleteResponseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("GetResponseSchema should validate correct data", () => {
    const result = GetResponseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("GetResponseSchema should fail on invalid data", () => {
    const result = GetResponseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("UpdateResponseSchema should validate correct data", () => {
    const result = UpdateResponseSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("UpdateResponseSchema should fail on invalid data", () => {
    const result = UpdateResponseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
