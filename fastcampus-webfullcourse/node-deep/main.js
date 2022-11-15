// @ts-check

'use strict';

const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.end('Hello!');
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log('The server is running at port:', PORT);
});
