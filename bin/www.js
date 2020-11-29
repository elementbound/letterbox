#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js'
import { createServer } from 'http'
import ws from 'ws'
import { WebSocketEventEmitter } from '../services/ws-event-emitter.js'
import debug from 'debug'
import hiHandler from '../handlers/hi.handler.js'
import userChangeLetterHandler from '../handlers/user.letter.change.handler.js'
import { createEmptyState, getCurrentState, initHistory, isStateDirty, setInitialState } from '../services/letter-history.js'
import { createStateUpdateMessage } from '../data/messages.js'
import config from '../services/config.js'

const debugLogger = debug('letterbox:server')

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(config.server.port || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = createServer(app)

/**
 * Create WS server.
 */
const wsServer = new ws.Server({ server })

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debugLogger('Listening on ' + bind)
}

/**
 * Listen to WS connect events
 */
const wsEvents = new WebSocketEventEmitter()

wsServer.on('connection', socket => {
  console.log('New connection!')
  socket.sendObject = (data) => socket.send(JSON.stringify(data))

  // Update new client with current state
  socket.sendObject(
    createStateUpdateMessage(config.letterbox.width, config.letterbox.height, getCurrentState())
  )

  // Emit events on messages
  socket.on('message', data => {
    const result = JSON.parse(data)

    wsEvents.emit('message', socket, result)
  })
})

wsServer.broadcast = data => {
  wsServer.clients.forEach(ws => ws.send(data))
}

wsServer.broadcastObject = data => {
  wsServer.clients.forEach(ws => ws.send(JSON.stringify(data)))
}

/**
 * Register WS handlers
 */
hiHandler(wsServer, wsEvents)
userChangeLetterHandler(wsServer, wsEvents)

// Set initial state
setInitialState(createEmptyState(config.letterbox.width * config.letterbox.height))
initHistory()

// Periodically push new state to clients
const statePushInterval = config.letterbox.updateInterval
setInterval(() => {
  if (isStateDirty()) {
    console.log('Broadcasting state')
    const state = getCurrentState()
    wsServer.broadcastObject(
      createStateUpdateMessage(config.letterbox.width, config.letterbox.height, state)
    )
  }
}, statePushInterval)
