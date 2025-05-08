// configuration/ConfigLoader.ts
import { DevAppConfig } from '@/configuration/DevAppConfig'
import { ProdAppConfig } from '@/configuration/ProdAppConfig'

export function loadConfig() {
  const isProd = process.env.NODE_ENV === 'production'
  return isProd ? ProdAppConfig : DevAppConfig
}
