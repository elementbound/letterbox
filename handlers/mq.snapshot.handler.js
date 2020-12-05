import { pushSnapshot } from '../services/letter-history.js'

/**
 * Register handler for snapshot events coming from the message queue.
 * @param {import('../data/snapshots.js').SnaphotsRepository} snapshotEvents
 */
export default function registerMQSnapshotHandler (snapshotEvents) {
  snapshotEvents.on('message', message => {
    pushSnapshot(message)
  })
}
