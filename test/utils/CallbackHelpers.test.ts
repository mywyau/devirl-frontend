import { describe, expect, it } from "vitest";
import { getSessionCookieHeader } from "../../utils/CallbackHelpers";

describe("getSessionCookieHeader", () => {
  it("returns an empty string if input is undefined", () => {
    expect(getSessionCookieHeader(undefined)).toBe("");
  });

  it("returns an empty string if input is null", () => {
    expect(getSessionCookieHeader(null as any)).toBe("");
  });

  it("returns the first part of a single Set-Cookie string", () => {
    const input = "session=abc123; Path=/; HttpOnly";
    expect(getSessionCookieHeader(input)).toBe("session=abc123");
  });

  it("returns the joined first parts of multiple Set-Cookie strings", () => {
    const input = [
      "session=abc123; Path=/; HttpOnly",
      "token=xyz789; Secure; HttpOnly",
    ];
    expect(getSessionCookieHeader(input)).toBe("session=abc123; token=xyz789");
  });

  it("handles number input by converting to string", () => {
    expect(getSessionCookieHeader(123456)).toBe("123456");
  });
});
