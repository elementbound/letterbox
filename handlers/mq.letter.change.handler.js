import { pushChange } from '../services/letter-history.js'

/**
 * Register handler for letter change events coming from the message queue.
 * @param {import('events').EventEmitter} historyMqEvents History event emitter
 */
export default function registerMQChangeHandler (historyMqEvents) {
  historyMqEvents.on('message', message => {
    pushChange(message)
  })
}
