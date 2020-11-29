import { EventTypes } from '../../data/messages.js'
import { range } from '../../services/utils.js'
import { getContext } from '../context.js'

/**
 * Handle a state update message.
 * @param {import("../../data/messages").StateUpdateMessage} message Message
 */
function handleStateUpdate (message) {
  if (message.type !== EventTypes.StateUpdate) {
    return
  }

  const data = message.data
  const context = getContext()

  range(data.state.length).forEach(i => {
    context.letters[i].innerText = data.state.charAt(i)
  })
}

/**
 * Register the state update event handler
 * @param {WebSocket} webSocket Connection to server
 */
export function registerStateUpdateHandler (webSocket) {
  webSocket.addEventListener('message', rawMessage =>
    handleStateUpdate(JSON.parse(rawMessage.data))
  )
}
