export const EventTypes = Object.freeze({
  Hi: 'Hi',
  ChangeLetter: 'Change-Letter',
  StateUpdate: 'State-Update'
})

/**
 * Create a generic message.
 * @param {string} type Message type
 * @param {*} data Message data
 * @returns {GenericMessage} Message
 */
export function createMessage (type, data) {
  return {
    type, data
  }
}

/**
 * Create a Hi message.
 * @returns {HiMessage} Message
 */
export function createHiMessage () {
  return createMessage(EventTypes.Hi)
}

/**
 * Create a change letter message.
 *
 * @param {number} index Changed character index
 * @param {string} value Changed character value
 * @returns {ChangeLetterMessage} Message
 */
export function createChangeLetterMessage (index, value) {
  return createMessage(EventTypes.ChangeLetter, {
    index, value
  })
}

/**
 * Create a state update message.
 *
 * @param {string | string[]} state State
 * @returns {StateUpdateMessage} Message
 */
export function createStateUpdateMessage (state) {
  return {
    type: EventTypes.StateUpdate,
    data: {
      state: Array.isArray(state)
        ? state.join('')
        : state
    }
  }
}

/**
 * @typedef {Object} GenericMessage
 * @property {string} type Message type
 * @property {*} data Message data
 */

/**
 * @typedef {Object} HiMessage
 * @property {string} type Message type
 */

/**
 * @typedef {Object} ChangeLetterMessage
 * @property {string} type Message type
 * @property {object} data Message data
 * @property {number} data.index Changed character index
 * @property {string} data.value Changed character value
 */

/**
 * @typedef {Object} StateUpdateMessage
 * @property {string} type Message type
 * @property {object} data Message data
 * @property {string} data.state State
 */
