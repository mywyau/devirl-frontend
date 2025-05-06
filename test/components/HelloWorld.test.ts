import { describe, expect, it } from "vitest";
// import MyComponent from "../MyComponent.vue";

describe("MyComponent", () => {
  it("renders properly", () => {
    const hello = "Hello";
    expect(hello).toContain("Hello");
  });
});
