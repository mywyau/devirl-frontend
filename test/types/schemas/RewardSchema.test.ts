import { describe, expect, it } from "vitest";
import { RewardDataSchema } from "../../../types/schema/RewardSchema"; // adjust the path as needed

describe("RewardDataSchema", () => {
  const validData = {
    questId: "quest-123",
    clientId: "client-456",
    devId: "dev-789",
    rewardValue: 150,
    paid: true,
  };

  it("validates a fully populated reward object", () => {
    const result = RewardDataSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates when optional fields are omitted", () => {
    const partialData = {
      questId: "quest-abc",
      clientId: "client-def",
      paid: false,
    };
    const result = RewardDataSchema.safeParse(partialData);
    expect(result.success).toBe(true);
  });

  it("validates when optional fields are explicitly null", () => {
    const data = {
      questId: "quest-null",
      clientId: "client-null",
      devId: null,
      rewardValue: null,
      paid: false,
    };
    const result = RewardDataSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("fails if questId is missing", () => {
    const { questId, ...invalidData } = validData;
    const result = RewardDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if rewardValue is a string", () => {
    const invalidData = { ...validData, rewardValue: "100" };
    const result = RewardDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if paid is missing", () => {
    const { paid, ...invalidData } = validData;
    const result = RewardDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if paid is not a boolean", () => {
    const invalidData = { ...validData, paid: "yes" };
    const result = RewardDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
