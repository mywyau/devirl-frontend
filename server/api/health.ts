// ./server/api/health.ts
import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
    return {
      status: 'ok',
      message: 'Nuxt frontend is alive',
      timestamp: new Date().toISOString(),
    };
  });
  