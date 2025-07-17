import { describe, it, expect } from "vitest";
import {
  UserTypeSchema,
  LoginUserDataSchema,
  RegistrationPayloadSchema,
  GetUserDataSchema,
} from "../../../types/schema/UserDataSchema";

describe("UserTypeSchema", () => {
  it("accepts valid values", () => {
    expect(UserTypeSchema.parse("Dev")).toBe("Dev");
    expect(UserTypeSchema.parse("Client")).toBe("Client");
    expect(UserTypeSchema.parse("UnknownUserType")).toBe("UnknownUserType");
  });

  it("rejects invalid values", () => {
    expect(() => UserTypeSchema.parse("Admin")).toThrow();
    expect(() => UserTypeSchema.parse("")).toThrow();
  });
});

describe("LoginUserDataSchema", () => {
  const valid = {
    email: "john@example.com",
  };

  it("validates when required fields are present", () => {
    const result = LoginUserDataSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("allows optional userType", () => {
    const result = LoginUserDataSchema.safeParse({ ...valid, userType: "Client" });
    expect(result.success).toBe(true);
  });

  it("fails when required fields are missing", () => {
    const result = LoginUserDataSchema.safeParse({ firstName: "John" });
    expect(result.success).toBe(false);
    expect(result.error.issues.some(issue => issue.path.includes("email"))).toBe(true);
  });

  it("rejects invalid userType", () => {
    const result = LoginUserDataSchema.safeParse({ ...valid, userType: "Admin" });
    expect(result.success).toBe(false);
  });
});

describe("RegistrationPayloadSchema", () => {

  it("passes with valid userType", () => {

    const result = RegistrationPayloadSchema.safeParse({ 
      username: "Goku",
      firstName: "bob",
      lastName: "smith",
      userType: "Dev"
     });
    expect(result.success).toBe(true);
  });

  it("fails with missing userType", () => {
    const result = RegistrationPayloadSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("fails with invalid userType", () => {
    const result = RegistrationPayloadSchema.safeParse({ userType: "Admin" });
    expect(result.success).toBe(false);
  });
});

describe("GetUserDataSchema", () => {
  const base = {
    userId: "u123",
    email: "a@b.com",
    username: "goku",
    firstName: "Alice",
    lastName: "Smith"
  };

  it("passes with all required fields", () => {
    const result = GetUserDataSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("allows optional userType", () => {
    const result = GetUserDataSchema.safeParse({ ...base, userType: "UnknownUserType" });
    expect(result.success).toBe(true);
  });

  it("fails with missing fields", () => {
    const result = GetUserDataSchema.safeParse({ userId: "u1" });
    expect(result.success).toBe(false);
    expect(result.error.issues.some(i => i.path.includes("email"))).toBe(true);
  });

  it("fails with invalid userType", () => {
    const result = GetUserDataSchema.safeParse({ ...base, userType: "SuperAdmin" });
    expect(result.success).toBe(false);
  });
});
