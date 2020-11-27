import { EventTypes } from '../data/messages.js'

export default function userChangeLetterHandler (wsEvents) {
  wsEvents.on('message', (socket, message) => {
    if (message.type !== EventTypes.ChangeLetter) {
      return
    }

    console.log(`Change character #${message.data.index} to ${message.data.value}`)
  })
}
