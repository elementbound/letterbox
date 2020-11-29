import { range } from './utils.js'

export class LetterChangeEntry {
  /**
   * Create a letter change entry.
   * @param {Object} options Options
   * @param {number} options.index Changed letter index
   * @param {string} options.value New letter value
   * @param {number?} options.date Change timestamp
   */
  constructor (options) {
    this.index = options.index
    this.value = options.value
    this.date = options.date ?? (+new Date())
  }

  /**
   * Apply change to given state.
   * @param {string[]} state Target state
   */
  apply (state) {
    state[this.index] = this.value
  }
}

const history = []
let initialState = []
let currentState = []
let isDirty = false
let isSorted = false

function sortHistory () {
  if (isSorted) {
    return
  }

  console.log(`History not sorted, sorting with ${history.length} changes`)
  history.sort((a, b) => a.date - b.date)
  isSorted = true
  console.log('History sorted')
}

export function createEmptyState (size) {
  return range(size).map(() => ' ')
}

/**
 * Set initial state for letters.
 * @param {string[]} state Initial state
 */
export function setInitialState (state) {
  initialState = state
  isDirty = true
}

export function pushChange (changeEntry) {
  if (!(changeEntry instanceof LetterChangeEntry)) {
    throw new Error(`Change not an instance of LetterChangeEntry; change=${changeEntry}`)
  }

  isSorted &= history.length > 0
    ? changeEntry.date >= history[history.length - 1].date
    : true

  history.push(changeEntry)

  isDirty = true
}

export function getCurrentState () {
  if (isDirty) {
    console.log(`Letter state dirty, recalculating with ${history.length} changes`)

    currentState = [...initialState]
    sortHistory()
    history.forEach(change => change.apply(currentState))
    isDirty = false

    console.log('State updated!')
  }

  return currentState
}

export function isStateDirty () {
  return isDirty
}
