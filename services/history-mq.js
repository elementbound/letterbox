import { EventEmitter } from 'events'
import { LetterChangeEntry } from '../data/history.js'
import { getMQConnection } from './mq.js'

class HistoryMQEventEmitter extends EventEmitter { }

const EXCHANGE_NAME = 'history-exchange'

/**
 * @type {import('amqplib').Channel}
 */
let channel

/**
 * @type {string}
 */
let queue

const sentMessageIds = new Set()
const receivedMessageIds = new Set()

export const historyEvents = new HistoryMQEventEmitter()

export async function initHistoryMq () {
  const conn = await getMQConnection()
  channel = await conn.createChannel()

  await channel.assertExchange(EXCHANGE_NAME, 'fanout')
  queue = (await channel.assertQueue('', {
    exclusive: true
  })).queue

  console.log('Binding', { queue, exchange: EXCHANGE_NAME })
  channel.bindQueue(queue, EXCHANGE_NAME, '')

  channel.consume(queue, message => {
    const content = new LetterChangeEntry(JSON.parse(message.content.toString()))

    if (receivedMessageIds.has(content.id) || sentMessageIds.has(content.id)) {
      return
    }

    historyEvents.emit('message', content)
    receivedMessageIds.add(content.id)
  })
}

/**
 * Post a letter change event to other instances
 * @param {LetterChangeEntry} event Change entry
 */
export function postChangeEvent (event) {
  if (!(event instanceof LetterChangeEntry)) {
    throw new Error('Posted change event is not instance of LetterChangeEntry')
  }

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)))
  sentMessageIds.add(event.id)
}
