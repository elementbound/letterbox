export const EventTypes = Object.freeze({
  Hi: 'Hi',
  ChangeLetter: 'Change-Letter'
})

export function createMessage (type, data) {
  return {
    type, data
  }
}

export function createHiMessage () {
  return createMessage(EventTypes.Hi)
}

export function createChangeLetterMessage (index, value) {
  return createMessage(EventTypes.ChangeLetter, {
    index, value
  })
}
