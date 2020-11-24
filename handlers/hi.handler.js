export default function hiHandler (wsEvents) {
  wsEvents.on('message', (socket, message) => {
    if (message.type !== 'Hi') {
      return
    }

    console.log('Greetings!')
  })
}
