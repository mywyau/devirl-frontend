import { describe, it, expect } from "vitest";
import { QuestPartialSchema, QuestStatusSchema } from "@/types/schema/QuestStatusSchema";


describe("QuestStatusSchema", () => {
  it("accepts valid status values", () => {
    expect(() => QuestStatusSchema.parse("NotStarted")).not.toThrow();
    expect(() => QuestStatusSchema.parse("InProgress")).not.toThrow();
    expect(() => QuestStatusSchema.parse("Completed")).not.toThrow();
  });

  it("rejects invalid status value", () => {
    expect(() => QuestStatusSchema.parse("Paused")).toThrow();
    expect(() => QuestStatusSchema.parse("")).toThrow();
  });
});

describe("QuestPartialSchema", () => {
  const validData = {
    clientId: "user123",
    questId: "quest456",
    title: "Slay the Dragon",
    description: "Defeat the fire-breathing beast.",
    status: "InProgress",
  };

  it("validates correct quest data", () => {
    const result = QuestPartialSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts null or undefined description", () => {
    const result1 = QuestPartialSchema.safeParse({ ...validData, description: null });
    const result2 = QuestPartialSchema.safeParse({ ...validData, description: undefined });

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
  });

  it("fails when required fields are missing", () => {
    const invalid = {
      questId: "q1",
      title: "Missing clientId",
      status: "NotStarted",
    };

    const result = QuestPartialSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    expect(result.error.issues.some(issue => issue.path.includes("clientId"))).toBe(true);
  });

  it("fails when status is invalid", () => {
    const invalid = { ...validData, status: "Paused" };
    const result = QuestPartialSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    expect(result.error.issues.some(issue => issue.path.includes("status"))).toBe(true);
  });
});
