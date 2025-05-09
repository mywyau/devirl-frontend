// server/api/proxy/session.post.ts
import { readBody, getRequestHeaders, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const headers = getRequestHeaders(event);

  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || "http://localhost:8080";

  const sub = body.sub;

  const scalaUrl = `${apiBase}/auth/session/${encodeURIComponent(sub)}`;

  console.log("[Proxy] Posting to Scala backend:", scalaUrl);

  const response = await fetch(scalaUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie: headers.cookie || "",
    },
  });

  const contentType = response.headers.get("content-type") ?? "";

  console.log("[Proxy] Response Content-Type:", contentType);
  console.log("[Proxy] Response Status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Proxy] Backend error response:", errorText);
    throw createError({
      statusCode: response.status,
      message: errorText || "Unknown backend error",
    });
  }

  if (contentType.includes("application/json")) {
    return await response.json();
  }

  return await response.text(); // fallback
});
