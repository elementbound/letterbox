/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./client/events/user-letter-change.js
/**
 * An event describing a single letter change in the letterbox.
 *
 * An important distinction to make is that *user* letter change events originate from the user, while regular letter
 * change events originate from the server.
 */
class UserLetterChangeEvent extends Event {
  /**
   * Create a user letter change event.
   * @param {number} index changed letter index
   * @param {string} newValue new letter value
   */
  constructor (index, newValue) {
    super(UserLetterChangeEvent.eventName)

    this.index = index
    this.newValue = newValue
  }

  static get eventName () {
    return 'user-letter-change'
  }
}

/* harmony default export */ const user_letter_change = (UserLetterChangeEvent);

;// CONCATENATED MODULE: ./client/letters.js


function generateItems (target, width, height) {
  const result = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const element = document.createElement('span')
      element.innerText = String.fromCharCode(48 + 64 * Math.random())
      target.appendChild(element)

      result.push(element)
    }

    const lineBreak = document.createElement('br')
    target.appendChild(lineBreak)
  }

  return result
}

function moveFocus (context, offset) {
  let result = (context.focus + offset) % context.letters.length

  while (result < 0) { result += context.letters.length }

  return {
    ...context,
    focus: result
  }
}

function updateFocus (context) {
  context.letters.forEach((letter, index) =>
    index === context.focus
      ? letter.classList.add('highlight')
      : letter.classList.remove('highlight')
  )
}

function handleKey (context, e) {
  if (e.code === 'ArrowRight') {
    context = moveFocus(context, 1)
  } else if (e.code === 'ArrowLeft') {
    context = moveFocus(context, -1)
  } else if (e.code === 'ArrowUp') {
    context = moveFocus(context, -context.width)
  } else if (e.code === 'ArrowDown') {
    context = moveFocus(context, context.width)
  } else if (e.key.length === 1) {
    const value = e.key.match(/\s/)
      ? '_'
      : e.key

    context.letters[context.focus].innerText = value

    context.letterbox.dispatchEvent(new user_letter_change(context.focus, value))

    context = moveFocus(context, 1)
  }

  updateFocus(context)

  return context
}

;// CONCATENATED MODULE: ./client/index.js



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

  letterbox.addEventListener(user_letter_change.eventName, event => {
    console.log('User letter change!', event)
  })

  wsConnect()
}

boot()

/******/ })()
;
//# sourceMappingURL=main.js.map