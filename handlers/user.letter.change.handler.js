import { EventTypes } from '../data/messages.js'
import { LetterChangeEntry, pushChange } from '../services/letter-history.js'

export default function userChangeLetterHandler (wsServer, wsEvents) {
  wsEvents.on('message', (socket, message) => {
    if (message.type !== EventTypes.ChangeLetter) {
      return
    }

    const changeEntry = new LetterChangeEntry({
      index: message.data.index,
      value: message.data.value
    })

    pushChange(changeEntry)

    console.log(`Change character #${message.data.index} to ${message.data.value}`)
  })
}
