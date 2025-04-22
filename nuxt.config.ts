// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ["@/assets/css/tailwind.css"],
  devServer: {
    host: "0.0.0.0", // 👈 bind inside container
    port: 3000,
  }
})
