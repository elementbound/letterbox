import mysql from 'mysql'
import util from 'util'
import config from './config.js'

let databaseConnectionPool

export function getDatabase () {
  if (!databaseConnectionPool) {
    console.log('Setting up DB connection pool...')

    databaseConnectionPool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      connectionLimit: config.db.poolSize,
      database: config.db.dbName
    })

    databaseConnectionPool.query = util.promisify(databaseConnectionPool.query).bind(databaseConnectionPool)

    console.log('Connection pool created')
  }

  return databaseConnectionPool
}
