// utils/sanitizer.ts

type Primitive = string | number | boolean | null | undefined;
type Sanitizable = Primitive | Sanitizable[] | { [key: string]: Sanitizable };

/**
 * Sanitizes a string by trimming whitespace and escaping HTML.
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Recursively sanitizes arrays of strings or nested objects.
 */
export function sanitizeArray(inputs: unknown[]): unknown[] {
  return inputs.map((item) => sanitizeValue(item));
}

/**
 * Sanitizes any value — string, array, or object — recursively.
 */
export function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeString(value);
  } else if (Array.isArray(value)) {
    return sanitizeArray(value);
  } else if (value !== null && typeof value === "object") {
    return sanitizeObject(value as Record<string, unknown>);
  }
  return value; // numbers, booleans, null, undefined
}

/**
 * Recursively sanitizes all string fields in an object.
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  for (const key in obj) {
    sanitized[key] = sanitizeValue(obj[key]);
  }
  return sanitized as T;
}
