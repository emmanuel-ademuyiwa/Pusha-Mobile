module.exports = function loadAppEnvVars() {
  const APP_ENV = process.env.APP_ENV || 'dev'

  const {parsed, error} = require('dotenv-flow').config({
    path: __dirname,
    node_env: APP_ENV,
    silent: true
  })

  if (error) throw error

  parsed.APP_ENV = APP_ENV
  parsed.NODE_ENV = process.env.NODE_ENV || 'development'

  for (const key of [
    'APP_ENV',
    'APP_SLUG',
    'BUNDLE_ID',
    'PROJECT_ID',
    'BASE_URL',
    'CLOUDINARY_NAME',
    'STORE_DOMAIN',
    'VEXO_ID'
  ]) {
    parsed[key] = process.env[key] || parsed[key]
  }

  return parsed
}
