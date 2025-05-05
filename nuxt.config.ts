// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: "node-server", 
  },
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
      auth0Domain: process.env.NUXT_PUBLIC_AUTH0_DOMAIN,
      auth0ClientId: process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID,
      auth0Audience: process.env.NUXT_PUBLIC_AUTH0_AUDIENCE,
      auth0CallbackUrl: process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL,
    },
    auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET, // private by default
  },
});
