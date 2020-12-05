import { getDatabase } from '../services/database.js'

export class SnapshotEntry {
  /**
   * Create a snapshot entry
   * @param {object} options Options
   * @param {Date} options.date Snapshot date
   * @param {string} options.state Snapshot state
   */
  constructor (options) {
    this.date = options.date ? new Date(options.date) : new Date()
    this.state = options.state
  }
}

export class SnaphotsRepository {
  /**
   * Persist a snapshot entry in the database
   * @param {SnapshotEntry} snapshotEntry Snapshot entry
   */
  async save (snapshotEntry) {
    if (!(snapshotEntry instanceof SnapshotEntry)) {
      throw new Error('Invalid snapshot entry type: ' + typeof snapshotEntry)
    }

    return getDatabase().query('INSERT INTO snapshots (date, state) VALUES (?, ?)',
      [snapshotEntry.date, snapshotEntry.state.join('')])
  }

  /**
   * Get the latest snapshot entry from the database.
   *
   * @returns {Promise<SnapshotEntry | undefined>} Snapshot entry or undefined if none exists
   */
  async getLatest () {
    const query = `SELECT *
      FROM snapshots
      ORDER BY date DESC
      LIMIT 1`

    const result = (await getDatabase().query(query))
      .map(row => new SnapshotEntry(row))[0]

    result && (result.state = result.state.split(''))

    return result
  }
}

export const snapshotRepository = new SnaphotsRepository()
