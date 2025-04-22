export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL || "http://localhost:8080", // default for local dev
    },
  },

  nitro: {
    preset: "node",
  },

  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },

  compatibilityDate: "2025-04-22",
});