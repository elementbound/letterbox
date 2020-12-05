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

function tryParseJson (content) {
  try {
    return JSON.parse(content)
  } catch (e) {
    return undefined
  }
}

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
    const parsed = tryParseJson(message.content.toString())
    if (!parsed) {
      console.log('Rejecting unparseable message', message.content.toString())
      return
    }

    const content = new LetterChangeEntry(parsed)

    console.log('Received message from MQ', message.content.toString())

    if (receivedMessageIds.has(content.id) || sentMessageIds.has(content.id)) {
      console.log('Rejecting message with known id', content.id)
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

  const result = channel.publish(EXCHANGE_NAME, '', Buffer.from(JSON.stringify(event)))
  if (!result) {
    console.warn('Failed to broadcast message on MQ', event)
    return
  }

  sentMessageIds.add(event.id)
}
