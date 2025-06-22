import { describe, expect, it } from "vitest";

import {
    sanitizeArray,
    sanitizeObject,
    sanitizeString,
    sanitizeValue,
} from "../../utils/Sanitizer";

describe("sanitizeString", () => {
  it("trims whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("escapes angle brackets", () => {
    expect(sanitizeString("<script>")).toBe("&lt;script&gt;");
  });

  it("handles mixed cases", () => {
    expect(sanitizeString("  <b>Hello>  ")).toBe("&lt;b&gt;Hello&gt;");
  });
});

describe("sanitizeArray", () => {
  it("sanitizes an array of strings", () => {
    expect(sanitizeArray(["  test ", "<div>", "clean"])).toEqual([
      "test",
      "&lt;div&gt;",
      "clean",
    ]);
  });

  it("recursively sanitizes nested arrays", () => {
    expect(sanitizeArray([" <hi> ", [" <x> ", " y "], 42, null])).toEqual([
      "&lt;hi&gt;",
      ["&lt;x&gt;", "y"],
      42,
      null,
    ]);
  });
});

describe("sanitizeObject", () => {
  it("sanitizes string fields", () => {
    const input = {
      name: " <John> ",
      role: "  dev ",
      age: 30,
      active: true,
    };
    const expected = {
      name: "&lt;John&gt;",
      role: "dev",
      age: 30,
      active: true,
    };
    expect(sanitizeObject(input)).toEqual(expected);
  });

  it("sanitizes nested objects and arrays", () => {
    const input = {
      title: " <Hello> ",
      meta: {
        tags: [" <tag1> ", " clean "],
        safe: true,
      },
      count: 5,
    };
    const expected = {
      title: "&lt;Hello&gt;",
      meta: {
        tags: ["&lt;tag1&gt;", "clean"],
        safe: true,
      },
      count: 5,
    };
    expect(sanitizeObject(input)).toEqual(expected);
  });
});

describe("sanitizeValue", () => {
  it("returns sanitized string", () => {
    expect(sanitizeValue(" <abc> ")).toBe("&lt;abc&gt;");
  });

  it("returns sanitized array", () => {
    expect(sanitizeValue([" <a> ", " b "])).toEqual(["&lt;a&gt;", "b"]);
  });

  it("returns sanitized object", () => {
    expect(sanitizeValue({ msg: " <bad> ", num: 1 })).toEqual({
      msg: "&lt;bad&gt;",
      num: 1,
    });
  });

  it("returns untouched primitive", () => {
    expect(sanitizeValue(123)).toBe(123);
    expect(sanitizeValue(true)).toBe(true);
    expect(sanitizeValue(null)).toBe(null);
    expect(sanitizeValue(undefined)).toBe(undefined);
  });
});
