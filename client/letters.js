import UserLetterChangeEvent from './events/user-letter-change.js'

export function generateItems (target, width, height) {
  const result = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const element = document.createElement('span')
      element.innerText = ' '
      target.appendChild(element)

      result.push(element)
    }

    const lineBreak = document.createElement('br')
    target.appendChild(lineBreak)
  }

  return result
}

export function moveFocus (context, offset) {
  let result = (context.focus + offset) % context.letters.length

  while (result < 0) { result += context.letters.length }

  return {
    ...context,
    focus: result
  }
}

/**
 * Update focused character in context.
 * @param {import('./context.js').AppContext} context App context
 */
export function updateFocus (context) {
  console.log('Updating focus on context', context)

  context.letters.forEach((letter, index) =>
    index === context.focus
      ? letter.classList.add('highlight')
      : letter.classList.remove('highlight')
  )
}

export function handleKey (context, e) {
  if (e.code === 'ArrowRight') {
    context = moveFocus(context, 1)
  } else if (e.code === 'ArrowLeft') {
    context = moveFocus(context, -1)
  } else if (e.code === 'ArrowUp') {
    context = moveFocus(context, -context.width)
  } else if (e.code === 'ArrowDown') {
    context = moveFocus(context, context.width)
  } else if (e.key.length === 1) {
    const value = e.key

    context.letters[context.focus].innerText = value

    context.letterbox.dispatchEvent(new UserLetterChangeEvent(context.focus, e.key))

    context = moveFocus(context, 1)
  }

  updateFocus(context)

  return context
}
