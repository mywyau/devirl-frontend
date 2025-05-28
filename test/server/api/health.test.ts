import { describe, it, expect } from 'vitest';
import healthHandler from '@/server/api/health';
import { createEvent } from 'h3';

describe("GET /api/health", () => {
  it("returns expected health response", async () => {
    const event = createEvent({}); // mock H3 event
    const response = await healthHandler(event);

    expect(response.status).toBe("ok");
    expect(response.message).toBe("Nuxt frontend is alive");
    expect(typeof response.timestamp).toBe("string");

    // Optional: Check timestamp format roughly
    expect(new Date(response.timestamp).toString()).not.toBe("Invalid Date");
  });
});
