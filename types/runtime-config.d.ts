export {}

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    // Server-only keys
  }

  interface PublicRuntimeConfig {
    auth0Domain: string
    auth0ClientId: string
  }
}
