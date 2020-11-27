import { createChangeLetterMessage } from '../../data/messages.js'
import UserLetterChangeEvent from '../events/user-letter-change.js'

/**
 * Catch and broadcast user letter change events from letterbox
 * @param {import('..').AppContext} context app context
 */
export default function registerChangeLetterAction (context) {
  context.letterbox.addEventListener(UserLetterChangeEvent.eventName, event => {
    context.webSocket.sendObject(createChangeLetterMessage(event.index, event.newValue))
  })
}
