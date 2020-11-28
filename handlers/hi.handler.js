import { EventTypes } from '../data/messages.js'

export default function hiHandler (wsServer, wsEvents) {
  wsEvents.on('message', (socket, message) => {
    if (message.type !== EventTypes.Hi) {
      return
    }

    console.log('Greetings!')
  })
}
