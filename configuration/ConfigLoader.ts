// configuration/ConfigLoader.ts
import { DevAppConfig } from './DevAppConfig'
import { ProdAppConfig } from './ProdAppConfig'

const isProd = process.env.NODE_ENV === 'production'

export const ConfigLoader = isProd ? ProdAppConfig : DevAppConfig
