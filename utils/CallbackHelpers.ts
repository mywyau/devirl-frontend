
export function getSessionCookieHeader(
  raw: string | string[] | number | undefined
): string {
  if (!raw) return "";
  return Array.isArray(raw)
    ? raw.map((h) => h.split(";")[0]).join("; ")
    : String(raw).split(";")[0];
}
