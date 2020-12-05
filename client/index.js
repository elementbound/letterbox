import { createHiMessage } from '../data/messages.js'
import registerChangeLetterAction from './actions/change-letter.js'
import { getContext, updateContext } from './context.js'
import UserLetterChangeEvent from './events/user-letter-change.js'
import { registerChangeLetterHandler } from './handlers/change-letter-handler.js'
import { registerStateUpdateHandler } from './handlers/state-update-handler.js'
import { generateItems, updateFocus, handleKey } from './letters.js'

function fitToScreen (element, scale) {
  const finalScale = scale * Math.min(
    window.innerWidth / element.offsetWidth,
    window.innerHeight / element.offsetHeight
  )

  element.style.scale = finalScale

  element.style.left = (window.innerWidth - element.offsetWidth) / 2
  element.style.top = (window.innerHeight - element.offsetHeight) / 2
}

function wsConnect () {
  const protocol = location.protocol.startsWith('https') ? 'wss' : 'ws'
  const url = `${protocol}://${window.location.host}/`

  console.log('Connecting to', url)

  const webSocket = new WebSocket(url)
  webSocket.sendObject = object =>
    webSocket.send(JSON.stringify(object))

  webSocket.onopen = () => {
    console.log('Socket open!')

    const message = JSON.stringify(createHiMessage())
    console.log('Sending message', message)
    webSocket.send(message)
  }

  webSocket.addEventListener('message', rawMessage => console.info('Received message', rawMessage.data))

  return webSocket
}

function boot () {
  const context = getContext()

  const letterbox = document.querySelector('.letterbox')
  updateContext({ letterbox })

  const letters = generateItems(letterbox, context.width, context.height)
  fitToScreen(letterbox, 0.9)

  window.onresize = () =>
    fitToScreen(letterbox, 0.9)

  updateContext({ letters })
  updateFocus(getContext())

  document.addEventListener('keydown', event => {
    updateContext(handleKey(getContext(), event))
  })

  context.webSocket = wsConnect()

  // Register actions
  registerChangeLetterAction(context)

  // Register message handlers
  registerChangeLetterHandler(context.webSocket)
  registerStateUpdateHandler(context.webSocket)
}

boot()
