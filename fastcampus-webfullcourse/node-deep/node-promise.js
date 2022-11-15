// @ts-check

const fs = require('fs');

function readFileSync() {
  return new Promise((res) => {
    fs.readFile('../.eslintrc.js', 'utf-8', (err, val) => {
      res(val);
    });
  });
}

fs.promises
  .readFile('../.eslintrc.js', 'utf-8')
  .then((result) => {})
  .catch((err) => {});
