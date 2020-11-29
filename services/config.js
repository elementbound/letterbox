import dotenv from 'dotenv-safe'

dotenv.config({ silent: process.env.NODE_ENV === 'production' })

function asInt (value) {
  return value
    ? +value
    : value
}

function deepFreeze (object) {
  Object.freeze(object)

  Object.values(object)
    .filter(val => typeof val === 'object')
    .forEach(val => deepFreeze(val))
}

function deepCopy (object) {
  return JSON.parse(JSON.stringify(object))
}

/**
 * @type {AppConfig}
 */
const config = {
  server: {
    port: asInt(process.env.PORT)
  },

  letterbox: {
    width: asInt(process.env.LETTERBOX_WIDTH),
    height: asInt(process.env.LETTERBOX_HEIGHT),
    updateInterval: asInt(process.env.LETTERBOX_UPDATE_INTERVAL_MS)
  },

  db: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    poolSize: asInt(process.env.DATABASE_POOL_SIZE),
    dbName: process.env.DATABASE_NAME
  }
}

deepFreeze(config)

const sanitizedConfig = deepCopy(config)
sanitizedConfig.db.password = '****'

console.log('Starting with config', sanitizedConfig)

export default config

/**
 * @typedef AppConfig
 * @property {ServerConfig} server Server config
 * @property {LetterboxConfig} letterbox Letterbox config
 * @property {DatabaseConfig} db Database config
 */

/**
 * @typedef ServerConfig
 * @property {number} port Port to listen on
 */

/**
 * @typedef LetterboxConfig
 * @property {number} width Letterbox width in characters
 * @property {number} height Letterbox height in characters
 * @property {number} updateInterval Interval at which to push state updates to clients
 */

/**
 * @typedef DatabaseConfig
 * @property {string} host Database host
 * @property {number} port Database port
 * @property {string} user Database user
 * @property {string} password Database user password
 * @property {number} poolSize Connection pool size
 * @property {string} dbName Database name
 */
