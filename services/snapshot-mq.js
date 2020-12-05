import { SnapshotEntry } from '../data/snapshots.js'
import { RabbitMessageQueue } from './mq.js'

class SnapshotMessageQueue extends RabbitMessageQueue {
  /**
   * Construct an *uninitialized* snapshot message queue.
   * @param {string} options.exchange Exchange name
   */
  constructor (options) {
    super({
      ...options,
      messageParser: message => new SnapshotEntry(message),
      messageValidator: event => {
        if (!(event instanceof SnapshotEntry)) {
          throw new Error('Posted change event is not instance of SnapshotEntry')
        }
      }
    })
  }
}

export const snapshotEvents = new SnapshotMessageQueue({
  exchange: 'snapshots-exchange'
})
