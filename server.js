// import of the native http module from Node to create a server
const http = require('http')
// import of our application
const app = require('./app')

// Returns a valid port, whether supplied as a number or a string
const normalizePort = val => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

// Searches for the various errors and handles them appropriately. It is then saved in the server
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
      break
    default:
      throw error
  }
}

// Creation of a server with the module ('http') as well as our application as parameters 
const server = http.createServer(app)

// An event listener logging the port or named pipe the server is running on in the console
server.on('error', errorHandler)
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind)
})
server.listen(port)

module.exports = app