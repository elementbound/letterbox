import * as uuid from 'uuid'
import { getDatabase } from '../services/database.js'

export class LetterChangeEntry {
  /**
   * Create a letter change entry.
   * @param {object} options Options
   * @param {number} options.at Changed letter index
   * @param {string} options.value New letter value
   * @param {string?} options.id Entry UUID
   * @param {number?} options.date Change timestamp
   */
  constructor (options) {
    this.at = options.at
    this.value = options.value
    this.date = options.date
      ? ((options.date instanceof Date) ? +options.date : +new Date(options.date))
      : (+new Date())
    this.id = uuid.validate(options.id)
      ? options.id
      : uuid.v4()
  }
}

export class HistoryRepository {
  /**
   * Persist a letter change in the database
   * @param {LetterChangeEntry} changeEntry Letter change entry
   */
  async save (changeEntry) {
    if (!(changeEntry instanceof LetterChangeEntry)) {
      throw new Error('Invalid change entry type: ' + typeof changeEntry)
    }

    return getDatabase().query('INSERT INTO `history`(`id`, `date`, `at`, `value`) VALUES (?, ?, ?, ?)',
      [changeEntry.id, new Date(changeEntry.date), changeEntry.at, changeEntry.value])
  }

  /**
   * List the entire history
   *
   * @returns {Promise<LetterChangeEntry[]>} History
   */
  async listHistory () {
    return (await getDatabase().query('SELECT * FROM `history`'))
      .map(row => new LetterChangeEntry(row))
  }

  /**
   * List the history beginning from a given date.
   *
   * @param {Date} date Start date
   * @returns {Promise<LetterChangeEntry[]>} History
   */
  async listHistorySince (date) {
    const query = `SELECT * FROM history
      WHERE date > ?`

    return (await getDatabase().query(query, [date]))
      .map(row => new LetterChangeEntry(row))
  }
}

export const historyRepository = new HistoryRepository()
