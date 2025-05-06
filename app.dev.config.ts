// app.dev.config.ts
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
    baseUrl: "http://localhost:3000",
  },
  devQuestBackend: {
    host: "localhost",
    port: "8080",
    baseUrl: "http://localhost:8080",
  },
};

export default config;
