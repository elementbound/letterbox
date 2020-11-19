function fitToScreen(element, scale) {
  const viewMin = Math.min(window.innerWidth, window.innerHeight)
  const boxMax = Math.max(element.offsetWidth, element.offsetHeight)

  const finalScale = scale * Math.min(
    window.innerWidth / element.offsetWidth,
    window.innerHeight / element.offsetHeight
  )

  element.style.scale = finalScale

  element.style.left = (window.innerWidth - element.offsetWidth) / 2
  element.style.top = (window.innerHeight - element.offsetHeight) / 2
}

function generateItems(target, width, height) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const element = document.createElement("span")
      element.innerText = String.fromCharCode(48 + 64 * Math.random())
      target.appendChild(element)
    }

    const lineBreak = document.createElement("br")
    target.appendChild(lineBreak)
  }
}

function boot() {
  generateItems(document.querySelector('.letterbox'), 80, 24)
  fitToScreen(document.querySelector('.letterbox'), 0.9)
}

boot()
