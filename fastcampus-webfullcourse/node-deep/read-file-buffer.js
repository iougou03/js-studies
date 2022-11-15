// @ts-check

const { log } = console;

const fs = require('fs');

const data = fs.readFileSync('./local/big-file', 'utf-8');

let prevCharacter = '';

/** @type {Object<string, number>} */
const numBlocksPerCharacter = {
  a: 0,
  b: 0,
};

for (let i = 0; i < data.length; i += 1) {
  if (data[i] !== prevCharacter) {
    const newCharacter = data[i];

    prevCharacter = newCharacter;

    numBlocksPerCharacter[newCharacter] += 1;
  }
}

log(numBlocksPerCharacter);
