import { historyRepository, LetterChangeEntry } from '../data/history.js'
import { EventTypes } from '../data/messages.js'
import { historyEvents } from '../services/history-mq.js'
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

    // Persist change in DB
    await historyRepository.save(changeEntry)

    // Push change to local history
    pushChange(changeEntry)

    // Push change to message queue to notify other running instances
    historyEvents.publish(changeEntry)

    console.log(`Change character #${message.data.index} to ${message.data.value}`)
  })
}
