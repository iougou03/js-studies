// @ts-check

const fs = require('fs');

const result = fs.readFileSync('./test.txt');

console.log(result);

// 1 byte = 8 bit (2^8 - 1)

const buf = Buffer.from([0, 0, 1, 0]);

function read32be(arr) {
  return [arr[0], arr[1] * 256, arr[2] * 256 ** 2, arr[3] * 256 ** 3];
}

console.log(buf.readInt32BE());
console.log(read32be(buf));

console.log(__dirname, '\n', __filename);
