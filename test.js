const http = require('http')
const tap = require('tap')
const listen = require('test-listen')
const httpIterator = require('./')

const forms = {
  server (server) {
    return httpIterator(server)
  },
  middleware (server) {
    const channel = httpIterator.middleware(cb => {
      server.on('request', cb)
    })
    server.on('close', () => channel.close())
    return channel
  }
}

for (let [ name, makeIterator ] of Object.entries(forms)) {
  tap.test(name, async t => {
    const input = 'hello world'
    const output = input.toUpperCase()

    const server = http.createServer()
    const promise = listenAndPost(server, input)

    const iterator = makeIterator(server)

    for await (let { request, response } of iterator) {
      t.ok(request instanceof http.IncomingMessage)
      t.ok(response instanceof http.ServerResponse)

      const body = await concat(request)
      t.equal(body.toString(), input)

      response.end(body.toString().toUpperCase())
      server.close()
    }

    const res = await promise
    t.equal(res.toString(), output)
  })
}

function request (url, opts, body) {
  return new Promise((resolve, reject) => {
    var req = http.request(url, opts, resolve)
    req.on('error', reject)
    req.end(body)
  })
}

async function concat (stream) {
  const chunks = []
  for await (let chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

async function listenAndPost (server, body) {
  const url = await listen(server)
  const opts = { method: 'POST' }
  return request(url, opts, body).then(concat)
}
