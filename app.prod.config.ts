// ✅ CORRECT in app.prod.config.ts
const config = {
  siteName: "Dev Irl",
  theme: {
    darkMode: true,
    primaryColor: "#1e90ff",
  },
  featuresSwitches: {
    payments: true,
    auth: true,
  },
  devIrlFrontend: {
    host: "localhost",
    port: "3000",
    baseUrl: "https://devirl.com",
  },
  devQuestBackend: {
    host: "localhost",
    port: "8080",
    baseUrl: "https://api.devirl.com/",
  },
};

export default config;
