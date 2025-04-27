// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["@/assets/css/tailwind.css"],

  devServer: {
    // host: "0.0.0.0", // 👈 bind inside container
    port: 3000,
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || "http://localhost:8080",
      auth0Domain: process.env.AUTH0_DOMAIN,
      auth0ClientId: process.env.AUTH0_CLIENT_ID,
      auth0Audience: process.env.AUTH0_AUDIENCE,
    },
    auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET, // private by default
  },
});
