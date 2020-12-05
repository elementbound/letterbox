import { LetterChangeEntry } from '../data/history.js'
import { RabbitMessageQueue } from './mq.js'

class HistoryMessageQueue extends RabbitMessageQueue {
  /**
   * Construct an *uninitialized* history message queue.
   * @param {string} options.exchange Exchange name
   */
  constructor (options) {
    super({
      ...options,
      messageParser: message => new LetterChangeEntry(message),
      messageValidator: event => {
        if (!(event instanceof LetterChangeEntry)) {
          throw new Error('Posted change event is not instance of LetterChangeEntry')
        }
      }
    })
  }
}

export const historyEvents = new HistoryMessageQueue({
  exchange: 'history-exchange'
})
