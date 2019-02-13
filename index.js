const Channel = require('channel-surfer')

function httpIterator (server) {
  const channel = middleware(cb => {
    server.on('request', cb)
  })
  server.on('close', () => channel.close())
  return channel
}

function middleware (task) {
  const channel = new Channel()
  task((request, response) => {
    channel.give({ request, response })
  })
  return channel
}

httpIterator.middleware = middleware
module.exports = httpIterator
