import { historyRepository, LetterChangeEntry } from '../data/history.js'
import { EventTypes } from '../data/messages.js'
import { pushChange } from '../services/letter-history.js'

export default function userChangeLetterHandler (wsServer, wsEvents) {
  wsEvents.on('message', async (socket, message) => {
    if (message.type !== EventTypes.ChangeLetter) {
      return
    }

    const changeEntry = new LetterChangeEntry({
      at: message.data.index,
      value: message.data.value
    })

    const result = await historyRepository.save(changeEntry)
    pushChange(changeEntry)
    console.log('Change persist result', result)

    console.log(`Change character #${message.data.index} to ${message.data.value}`)
  })
}
