// types/runtime-config.d.ts
export {}

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    // private, server-only
    auth0ClientSecret: string
  }

  interface PublicRuntimeConfig {
    // public, exposed to client
    auth0Domain: string
    auth0ClientId: string
    apiBase: string
  }
}
