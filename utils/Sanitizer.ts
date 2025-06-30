const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

function escapeHTML(str: string): string {
  return str.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char]);
}

export function sanitizeString(input: string): string {
  return escapeHTML(input.trim());
}

export function sanitizeArray(inputs: unknown[]): unknown[] {
  return inputs.map((item) => sanitizeValue(item));
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sanitized[key] = sanitizeValue(obj[key]);
    }
  }
  return sanitized as T;
}

export function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeString(value);
  } else if (Array.isArray(value)) {
    return sanitizeArray(value);
  } else if (value && typeof value === 'object' && !Array.isArray(value)) {
    return sanitizeObject(value as Record<string, unknown>);
  } else if (
    typeof value === 'function' ||
    typeof value === 'symbol'
  ) {
    return undefined;
  }
  return value;
}

