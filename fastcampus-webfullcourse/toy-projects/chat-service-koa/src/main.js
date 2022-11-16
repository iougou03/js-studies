const Koa = require('koa');
const Pug = require('koa-pug');
const route = require('koa-route');
const serve = require('koa-static');
const path = require('path');
const websockify = require('koa-websocket');
const mount = require('koa-mount');

const app = websockify(new Koa());

// eslint-disable-next-line no-new
new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
});

app.use(mount('/public', serve('public')));

app.use(async (ctx) => {
  await ctx.render('main');
});

app.ws.use(
  route.all('/ws', (ctx) => {
    ctx.websocket.on('message', (data) => {
      try {
        const parseData = JSON.parse(data.toString());

        const { message, nickname } = parseData;

        const { server } = app.ws;

        if (!server) {
          return;
        }

        server.clients.forEach((client) => {
          client.send(
            JSON.stringify({
              message,
              nickname,
            })
          );
        });
      } catch (err) {
        console.log(data.toString());
      }
    });
  })
);

app.listen(3000);
