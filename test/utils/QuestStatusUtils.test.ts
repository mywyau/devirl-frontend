import { describe, expect, it } from "vitest";
import { getStatusTextColour } from "../../utils/QuestStatusUtils"; // adjust the import path as needed

describe("getStatusTextColour", () => {
  
  it("returns green for Completed", () => {
    expect(getStatusTextColour("Completed")).toBe("text-green-500 dark:text-green-300");
  });

  it("returns red for Failed", () => {
    expect(getStatusTextColour("Failed")).toBe("text-red-500 dark:text-red-300");
  });

  it("returns blue for Review", () => {
    expect(getStatusTextColour("Review")).toBe("text-blue-500 dark:text-blue-300");
  });

  it("returns yellow for InProgress", () => {
    expect(getStatusTextColour("InProgress")).toBe("text-yellow-500 dark:text-yellow-300");
  });

  it("returns zinc for NotStarted", () => {
    expect(getStatusTextColour("NotStarted")).toBe("text-zinc-500 dark:text-zinc-400");
  });

  it("returns teal for Open", () => {
    expect(getStatusTextColour("Open")).toBe("text-teal-500 dark:text-teal-300");
  });

  it("returns default indigo for unknown status", () => {
    expect(getStatusTextColour("SomethingElse")).toBe("text-indigo-500 dark:text-indigo-300");
  });

  it("returns default indigo for null", () => {
    expect(getStatusTextColour(null)).toBe("text-indigo-500 dark:text-indigo-300");
  });

  it("returns default indigo for undefined", () => {
    expect(getStatusTextColour(undefined)).toBe("text-indigo-500 dark:text-indigo-300");
  });
});
