/**
 * @typedef {Object} AppContext
 * @property {number} width letterbox width in characters
 * @property {number} height letterbox height in characters
 * @property {Node} letterbox letterbox DOM node
 * @property {HTMLElement[]} letters letter DOM nodes
 * @property {number} focus focused character index
 * @property {WebSocket} webSocket web socket connection to server
 */

const context = {
  width: 80,
  height: 24,

  letterbox: undefined,
  letters: [],
  focus: 0,

  webSocket: undefined
}

const changeListeners = []

/**
 * Get current app context
 *
 * @returns {AppContext} app context
 */
export function getContext () {
  return context
}

export function updateContext (data) {
  console.log('Updating context', { context, data })

  Object.assign(context, data)

  console.log('Resulting context', context)

  changeListeners.forEach(listener => listener(context))
}

export function addContextChangeListener (listener) {
  changeListeners.push(listener)
}
