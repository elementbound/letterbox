let context = {
  width: 80,
  height: 24,

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

function boot () {
  const letterbox = document.querySelector('.letterbox')
  const letters = generateItems(letterbox, context.width, context.height)
  fitToScreen(letterbox, 0.9)

  window.onresize = () =>
    fitToScreen(letterbox, 0.9)

  context.letters = letters
  updateFocus(context)

  document.addEventListener('keydown', e => {
    let isMove = false

    if (e.code === 'ArrowRight') {
      isMove = true
      context = moveFocus(context, 1)
    } else if (e.code === 'ArrowLeft') {
      isMove = true
      context = moveFocus(context, -1)
    } else if (e.code === 'ArrowUp') {
      isMove = true
      context = moveFocus(context, -context.width)
    } else if (e.code === 'ArrowDown') {
      isMove = true
      context = moveFocus(context, context.width)
    } else if (e.key.length === 1) {
      context.letters[context.focus].innerText = e.key.match(/\s/)
        ? '_'
        : e.key
      context = moveFocus(context, 1)
      isMove = 1
    }

    if (isMove) { updateFocus(context) }
  })
}

boot()
