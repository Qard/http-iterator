# http-iterator

Convert http servers to async iterators.

## Install

```sh
npm install http-iterator
```

## API

All functions in this module return CSP channels via [channel-surfer](https://npmjs.org/package/channel-surfer).

### `httpIterator(server)`

```js
const httpIterator = require('http-iterator')
const http = require('http')

const server = http.createServer()
server.listen(3000)

for await (let { request, response } of httpIterator(server)) {
  response.end('hello world')
}
```

### `httpIterator.middleware(task)`

```js
const httpIterator = require('http-iterator')
const express = require('express')

const app = express()
const server = app.listen(3000)

const requests = httpIterator.middleware(handle => {
  app.get('/', handle)
})
// Stop requests channel when server stops
server.on('close', () => requests.close())

for await (let { request, response } of requests) {
  response.end('hello world')
}
```

---

### Copyright (c) 2019 Stephen Belanger

#### Licensed under MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
