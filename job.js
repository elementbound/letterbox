import { historyRepository } from './data/history.js'
import { SnapshotEntry, snapshotRepository } from './data/snapshots.js'
import config from './services/config.js'
import { connectToDatabase } from './services/database.js'
import { createEmptyState, getCurrentState, pushChange, setInitialState } from './services/letter-history.js'
import { getMQConnection } from './services/mq.js'
import { snapshotEvents } from './services/snapshot-mq.js'
import { wrap, logRetriesWrapper, retryWrapper, sleep } from './services/utils.js'

(async () => {
  /**
   * Setup dependencies with retry
   */
  try {
    console.log('Attempting connections')

    await Promise.all([
      wrap(connectToDatabase, logRetriesWrapper('Connect to DB'))
        .wrap(retryWrapper(config.db.attemptCount, config.db.attemptRest))(),
      wrap(getMQConnection, logRetriesWrapper('Connect to MQ'))
        .wrap(retryWrapper(config.mq.attemptCount, config.mq.attemptRest))()
    ])
  } catch (e) {
    console.error('Init failed with exception', e)
    process.exit(1)
  }

  /**
   * Get latest snapshot and calculate new one
   */
  const latestSnapshot = await snapshotRepository.getLatest()

  latestSnapshot
    ? setInitialState(latestSnapshot.state)
    : setInitialState(createEmptyState(config.letterbox.width * config.letterbox.height))

  const latestDate = latestSnapshot?.date ?? new Date(0)

  const newChanges = await historyRepository.listHistorySince(latestDate)

  if (newChanges.length === 0) {
    console.log('No new changes since last run')
    return
  }

  newChanges.forEach(change => pushChange(change))

  const newSnapshot = new SnapshotEntry({
    date: newChanges[newChanges.length - 1].date,
    state: getCurrentState()
  })

  console.log('Saving snapshot', newSnapshot)
  await snapshotRepository.save(newSnapshot)

  // Broadcast snapshot
  console.log('Broadcasting snapshot', newSnapshot)
  await snapshotEvents.open()
  snapshotEvents.publish(newSnapshot)

  // Sleep a bit so the message can enter the network
  await sleep(50)
})().catch(err => {
  console.error('Job run failed', err)
  process.exit(1)
}).then(() => {
  console.log('Successful run, goodbye!')
  process.exit(0)
})
