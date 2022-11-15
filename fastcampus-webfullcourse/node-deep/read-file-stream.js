// @ts-check

const { log } = console;

const fs = require('fs');

const rs = fs.createReadStream('local/big-file', {
  encoding: 'utf-8',
  highWaterMark: 65536 * 4, // buffer size of chunk = 65536 (= 256 ** 2) , 65536 * 4 = 1MB
});

let prevCharacter = '';
let chunkCount = 0;
/** @type {Object<string, number>} */
const numBlocksPerCharacter = {
  a: 0,
  b: 0,
};

rs.on('data', (data) => {
  chunkCount += 1;
  if (typeof data !== 'string') {
    return;
  }

  for (let i = 0; i < data.length; i += 1) {
    if (data[i] !== prevCharacter) {
      const newCharacter = data[i];

      prevCharacter = newCharacter;

      numBlocksPerCharacter[newCharacter] += 1;
    }
  }
});

rs.on('end', () => {
  log('End', numBlocksPerCharacter, chunkCount);
});
