import { createHiMessage } from '../data/messages.js'
import registerChangeLetterAction from './actions/change-letter.js'
import UserLetterChangeEvent from './events/user-letter-change.js'
import { generateItems, updateFocus, handleKey } from './letters.js'

/**
 * @typedef {Object} AppContext
 * @property {number} width letterbox width in characters
 * @property {number} height letterbox height in characters
 * @property {Node} letterbox letterbox DOM node
 * @property {number} focus focused character index
 * @property {WebSocket} webSocket web socket connection to server
 */

let context = {
  width: 80,
  height: 24,

  letterbox: undefined,
  letters: [],
  focus: 0,

  webSocket: undefined
}

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

  return webSocket
}

function boot () {
  const letterbox = document.querySelector('.letterbox')
  context.letterbox = letterbox

  const letters = generateItems(letterbox, context.width, context.height)
  fitToScreen(letterbox, 0.9)

  window.onresize = () =>
    fitToScreen(letterbox, 0.9)

  context.letters = letters
  updateFocus(context)

  document.addEventListener('keydown', event => {
    context = handleKey(context, event)
  })

  letterbox.addEventListener(UserLetterChangeEvent.eventName, event => {
    console.log('User letter change!', event)
  })

  context.webSocket = wsConnect()

  // Register actions
  registerChangeLetterAction(context)
}

boot()
