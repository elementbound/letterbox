export function createMessage (type, data) {
  return {
    type, data
  }
}

export function createHiMessage () {
  return createMessage('Hi')
}
