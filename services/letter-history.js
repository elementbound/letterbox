import { range } from './utils.js'
import { historyRepository, LetterChangeEntry } from '../data/history.js'

let history = []
let initialState = []
let currentState = []
let lastSnapshotDate = new Date(0)
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

/**
 * Apply change to given state.
 * @param {string[]} state Target state
 * @param {LetterChangeEntry} change Change entry
 */
function applyChange (state, change) {
  state[change.at] = change.value
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
    history.forEach(change => applyChange(currentState, change))
    isDirty = false

    console.log('State updated!')
  }

  return currentState
}

export function isStateDirty () {
  return isDirty
}

/**
 * Push new snapshot to history.
 * @param {import('../data/snapshots.js').SnapshotEntry} snapshot Snapshot entry
 */
export function pushSnapshot (snapshot) {
  if (snapshot.date < lastSnapshotDate) {
    console.log('Rejecting older snapshot', snapshot)
    return
  }

  history = history.filter(changeEntry => changeEntry.date > snapshot.date)
  initialState = snapshot.state

  lastSnapshotDate = snapshot.date
  isDirty = true
  isSorted = false
}

export async function initHistory () {
  history = await historyRepository.listHistory()
  console.log('Retrieved history from DB', history)
  isDirty = true
}
