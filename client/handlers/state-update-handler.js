import { EventTypes } from '../../data/messages.js'
import { range } from '../../services/utils.js'
import { getContext, updateContext } from '../context.js'
import { generateItems } from '../letters.js'

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

  if (data.width !== context.width || data.height !== context.height) {
    context.letters.forEach(letter =>
      context.letterbox.removeChild(letter)
    )

    const letters = generateItems(context.letterbox, data.width, data.height)

    updateContext({ letters, width: data.width, height: data.height })
  }

  range(data.state.length).forEach(i => {
    context.letters[i].innerText = data.state[i]
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
