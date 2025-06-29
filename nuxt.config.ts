// ./nuxt.config.ts

import { defineNuxtConfig } from "nuxt/config";



// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts"
  ],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700, 800],
      // Optional secondary font:
      "Space+Grotesk": [400, 500, 600],
    },
    display: "swap", // for better rendering performance
  },
  typescript: {
    strict: true,
    shim: false, // if you're confident with types
  },
  nitro: {
    preset: "node-server",
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["@/assets/css/tailwind.css"],

  devServer: {
    // host: "0.0.0.0", // 👈 bind inside container
    port: 3000,
  },
  debug: false,
  runtimeConfig: {
    public: {
      sessionSecret:
        process.env.SESSION_SECRET || "No session secret set for iron session",
      devIrlFrontendBaseUrl:
        process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000",
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        "http://localhost:8080/dev-quest-service",
      auth0Domain:
        process.env.NUXT_PUBLIC_AUTH0_DOMAIN ||
        "[nuxt.config.ts][auth0Domain] config undefined, please define it",
      auth0ClientId:
        process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID ||
        "[nuxt.config.ts][auth0ClientId] config undefined, please define it",
      auth0Audience:
        process.env.NUXT_PUBLIC_AUTH0_AUDIENCE ||
        "[nuxt.config.ts][auth0Audience] config undefined, please define it",
      auth0CallbackUrl:
        process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL ||
        "[nuxt.config.ts][auth0CallbackUrl] config undefined, please define it",
    },
    auth0ClientSecret:
      process.env.AUTH0_CLIENT_SECRET ||
      "[nuxt.config.ts][auth0ClientSecret] config undefined, please define it",
    test: process.env.TEST || "",
  },
});
