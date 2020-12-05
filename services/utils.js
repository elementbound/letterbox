export function range (n) {
  return [...new Array(n).keys()]
}

export async function sleep (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export function logRetriesWrapper (name) {
  return func => {
    return async (index, count, interval) => {
      console.log(`Retry ${name} #${index}/${count} with interval ${interval}`)
      await func()
    }
  }
}

export function retryWrapper (times, interval) {
  return func => {
    return async () => {
      for (let i = 1; i <= times; ++i) {
        try {
          return await func(i, times, interval)
        } catch (e) {
          if (i === times) {
            throw e
          } else {
            await sleep(interval)
          }
        }
      }
    }
  }
}

export function wrap (func, wrapper, ...args) {
  const result = wrapper(func, ...args)
  result.wrap = (wrapper, ...args) => wrap(result, wrapper, ...args)

  return result
}
