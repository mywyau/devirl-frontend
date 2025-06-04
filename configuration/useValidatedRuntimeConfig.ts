// configuration/useValidatedRuntimeConfig.ts
import { useRuntimeConfig } from "nuxt/app";
import { RuntimeConfigSchema } from "@/configuration/RuntimeConfig";

export const useValidatedRuntimeConfig = () => {

  const config = useRuntimeConfig().public;

  return RuntimeConfigSchema.parse(config);
};


// export const nuxtConfig = () => {

//   const config = useRuntimeConfig();

//   return config;
// };