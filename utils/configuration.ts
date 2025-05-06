// utils/configuration.ts

import type { AppConfig } from 'nuxt/schema'

export class Configuration {
  constructor(
    public readonly appConfig: AppConfig,
    public readonly runtimeConfig: {
      auth0Domain: string
      auth0ClientId: string
      auth0CallbackUrl: string
    }
  ) {}

  get devQuestBackendBaseUrl(): string {
    return this.appConfig.devQuestBackend.baseUrl
  }

  get loginUrl(): string {
    const { auth0Domain, auth0ClientId, auth0CallbackUrl } = this.runtimeConfig
    return `https://${auth0Domain}/authorize?response_type=code&client_id=${auth0ClientId}&redirect_uri=${auth0CallbackUrl}&scope=openid profile email`
  }

  get callbackUrl(): string {
    return this.runtimeConfig.auth0CallbackUrl
  }

  get paymentsEnabled(): boolean {
    return this.appConfig.featuresSwitches?.payments ?? false
  }
}
