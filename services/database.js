import mysql from 'mysql'
import util from 'util'
import config from './config.js'

let databaseConnectionPool

export function connectToDatabase () {
  return new Promise((resolve, reject) => {
    if (!databaseConnectionPool) {
      const pool = mysql.createPool({
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        connectionLimit: config.db.poolSize,
        database: config.db.dbName
      })

      pool.getConnection(err => {
        if (err) {
          console.error('Connection failed', err)
          reject(err)
        } else {
          console.log('Connection successful', pool, pool.query)
          pool.query = util.promisify(pool.query).bind(pool)
          databaseConnectionPool = pool
          resolve(databaseConnectionPool)
        }
      })
    } else {
      resolve(databaseConnectionPool)
    }
  })
}

export function getDatabase () {
  return databaseConnectionPool
}
