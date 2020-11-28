import { createChangeLetterMessage, EventTypes } from '../data/messages.js'

export default function userChangeLetterHandler (wsServer, wsEvents) {
  wsEvents.on('message', (socket, message) => {
    if (message.type !== EventTypes.ChangeLetter) {
      return
    }

    wsServer.broadcastObject(createChangeLetterMessage(message.data.index, message.data.value))

    console.log(`Change character #${message.data.index} to ${message.data.value}`)
  })
}
