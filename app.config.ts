// app.config.ts
import devConfig from './app.dev.config'
import prodConfig from './app.prod.config'

const env = process.env.NODE_ENV || 'development'

const config = env === 'production' ? prodConfig : devConfig

export default defineAppConfig(config)
