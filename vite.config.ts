// vitest.config.ts
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom", // consider 'happy-dom' if you want faster, more accurate DOM APIs
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.{test,spec}.{ts,js}"], // Optional: constrain test file matching
    coverage: {
      reporter: ["text", "json", "html"], // Optional: code coverage
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "~": path.resolve(__dirname, "./"),
    },
  },
});
