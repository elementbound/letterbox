import * as amqp from 'amqplib'
import config from './config.js'
import { EventEmitter } from 'events'
import { identity, tryParseJson } from './utils.js'

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

export class RabbitMessageQueue extends EventEmitter {
  /**
   * Construct an *uninitialized* message queue.
   * @param {object} options Options
   * @param {string} options.exchange Exchange name
   * @param {Function<string, any>} options.messageParser Message parser ran when receiving
   * @param {Function<any, any>} options.messageValidator Message validator ran before publishing
   */
  constructor (options) {
    super()

    this.exchange = options.exchange
    this.messageParser = options.messageParser ?? identity
    this.messageValidator = options.messageValidator ?? identity

    this._sentMessageIds = new Set()
    this._receivedMessageIds = new Set()
  }

  /**
   * Open message queue.
   *
   * @returns {Promise}
   */
  async open () {
    const connection = await getMQConnection()
    this.channel = await connection.createChannel()

    console.log('Asserting exchange', this.exchange)
    await this.channel.assertExchange(this.exchange, 'fanout')
    this.queue = await this.channel.assertQueue('', { exclusive: true })
    const queueName = this.queue.queue

    console.log(`Binding queue ${queueName} to exchange ${this.exchange}`)
    this.channel.bindQueue(queueName, this.exchange)

    this.channel.consume(queueName, message => {
      const parsed = tryParseJson(message.content.toString())
      if (!parsed) {
        console.log('Rejecting unparseable message', message.content.toString())
        return
      }

      const content = this.messageParser(parsed)

      if (content.id && (this._receivedMessageIds.has(content.id) || this._sentMessageIds.has(content.id))) {
        console.log('Rejecting message with known id', content.id)
        return
      }

      this.emit('message', content)
      this._receivedMessageIds.add(content.id)
    })
  }

  publish (message) {
    this.messageValidator(message)
    console.log(`Publishing message to exchange ${this.exchange}`)
    this.channel.publish(this.exchange, '', Buffer.from(JSON.stringify(message)))
    message.id && this._sentMessageIds.add(message.id)
  }
}
