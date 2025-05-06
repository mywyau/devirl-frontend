// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // or 'happy-dom'
    setupFiles: ['./test/setup.ts']
  }
})
