import { EventTypes } from '../../data/messages.js'
import { getContext } from '../context.js'

/**
 * Handle a change letter message.
 * @param {import("../../data/messages").ChangeLetterMessage} message Message
 */
function handleChangeLetter (message) {
  if (message.type !== EventTypes.ChangeLetter) {
    return
  }

  const data = message.data
  const context = getContext()
  context.letters[data.index].innerText = data.value
}

/**
 * Register the change letter event handler
 * @param {WebSocket} webSocket Connection to server
 */
export function registerChangeLetterHandler (webSocket) {
  webSocket.addEventListener('message', rawMessage =>
    handleChangeLetter(JSON.parse(rawMessage.data))
  )
}
