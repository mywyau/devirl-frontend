// types/app-config.d.ts
declare module "nuxt/schema" {
  interface AppConfig {
    siteName: string;
    theme: {
      darkMode: boolean;
      primaryColor: string;
    };
    featuresSwitches: {
      payments: boolean;
      auth: boolean;
    };
    devIrlFrontend: {
      host: string;
      port: string;
      baseUrl: string;
    };
    devQuestBackend: {
      host: string;
      port: string;
      baseUrl: string;
    };
  }
}

export { };

