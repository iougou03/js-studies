// @ts-check

const http = require('http');
const url = require('url');

const { routes } = require('./api');

/**
 * Post
 *
 * Get /posts
 * GET /posts/:id
 * POST /posts
 */
const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  // eslint-disable-next-line node/no-deprecated-api
  const { pathname } = url.parse(req.url);

  const route = routes.find(
    (_route) =>
      req.url &&
      req.method &&
      _route.url.test(pathname || '') &&
      _route.method === req.method
  );

  if (!route) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  const regexResult = route.url.exec(req.url);

  if (!regexResult) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  /** @type {Object<string, *> | undefined} */
  const body =
    (req.headers['content-type'] === 'application/json' &&
      (await new Promise((_res, _rej) => {
        req.setEncoding('utf-8');
        req.on('data', (data) => {
          try {
            _res(JSON.parse(data));
          } catch {
            _rej(new Error('Wrong format'));
          }
        });
      }))) ||
    undefined;

  const result = await route.callback(regexResult, body);
  res.statusCode = result.statusCode;

  if (typeof result.body === 'string') {
    res.end(result.body);
  } else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(result.body));
  }
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log('The server is listening a port:', PORT);
});
