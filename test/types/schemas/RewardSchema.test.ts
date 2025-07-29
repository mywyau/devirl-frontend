import { describe, expect, it } from "vitest";
import { RewardDataSchema } from "../../../types/schema/RewardSchema"; // adjust the path as needed

describe("RewardDataSchema", () => {
  const validData = {
    questId: "quest-123",
    clientId: "client-456",
    devId: "dev-789",
    timeRewardValue: 10,
    completionRewardValue: 100,
    paid: "NotPaid",
  };

  it("validates a fully populated reward object", () => {
    const result = RewardDataSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates when optional fields are omitted", () => {
    const partialData = {
      questId: "quest-abc",
      clientId: "client-def",
      paid: "NotPaid",
    };
    const result = RewardDataSchema.safeParse(partialData);
    expect(result.success).toBe(true);
  });

  it("validates when optional fields are explicitly null", () => {
    const data = {
      questId: "quest-null",
      clientId: "client-null",
      devId: null,
      timeRewardValue: null,
      completionRewardValue: null,
      paid: "NotPaid",
    };
    const result = RewardDataSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("fails if questId is missing", () => {
    const { questId, ...invalidData } = validData;
    const result = RewardDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

   it("fails if timeRewardValue is a string", () => {
    const invalidData = { ...validData, timeRewardValue: "100" };
    const result = RewardDataSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("fails if completionRewardValue is a string", () => {
    const invalidData = { ...validData, completionRewardValue: "100" };
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
