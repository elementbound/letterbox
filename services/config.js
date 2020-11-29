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
  }
}

deepFreeze(config)

console.log('Starting with config', config)

export default config

/**
 * @typedef AppConfig
 * @property {ServerConfig} server Server config
 * @property {LetterboxConfig} letterbox Letterbox config
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
