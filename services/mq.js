import * as amqp from 'amqplib'
import config from './config.js'

let connection

/**
 * Get an MQ connection.
 * @returns {Promise<amqp.Connection>} Connection
 */
export async function getMQConnection () {
  if (!connection) {
    connection = await amqp.connect(config.mq.address)
  }

  return connection
}
