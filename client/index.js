import UserLetterChangeEvent from './events/user-letter-change'
import { generateItems, updateFocus, handleKey } from './letters'

let context = {
  width: 80,
  height: 24,

  letterbox: undefined,
  letters: [],
  focus: 0
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
  webSocket.onopen = () => {
    console.log('Socket open!')
  }
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

  wsConnect()
}

boot()
