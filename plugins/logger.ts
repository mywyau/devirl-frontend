// plugins/logger.ts
import { defineNuxtPlugin } from '#app';
import consola from 'consola';

export default defineNuxtPlugin(() => {
  const logger = consola.withTag('dev-irl');

  // Set level based on environment
  if (process.env.NODE_ENV === 'production') {
    logger.level = 3; // Warn and Error only
  } else if (process.env.LOG_LEVEL) {
    logger.level = parseInt(process.env.LOG_LEVEL); // Allow override
  }

  return {
    provide: {
      logger,
    },
  };
});
