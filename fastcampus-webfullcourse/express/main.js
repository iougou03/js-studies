const express = require('express');

const userRouter = express.Router();

const app = express();
app.use(express.json());

const PORT = 5000;

app.set('views', 'src/views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index', {
    message: 'Hello, Pug!',
  });
});

app.use('/users', userRouter);

userRouter.param('id', (req, res, next, value) => {
  req.user = value;

  next();
});

// intended error
userRouter.get('/error', (req, res) => {
  const err = new Error('User not found');
  err.statusCode = 404;
  throw err;
});

userRouter.get('/:id', (req, res) => {
  const resMimeType = req.accepts(['json', 'html']);

  if (resMimeType === 'json') {
    res.send(`your id is, ${req.user}`);
  } else if (resMimeType === 'html') {
    res.render('user-profile', {
      nickname: 'foo',
    });
  }
  // else {
  // }
});

app.use('/public', express.static('src/public'));

app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500;
  res.send(err.message);
});

app.listen(PORT, () => {
  console.log('node server is opened at', PORT);
});
