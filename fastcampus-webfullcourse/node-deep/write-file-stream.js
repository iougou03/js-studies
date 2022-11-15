// @ts-check

// make a huge file
const fs = require('fs');

const ws = fs.createWriteStream('local/big-file');

const NUM_MBYTES = 500;

const numBlockPerCharacter = {
  a: 0,
  b: 0,
};

for (let i = 0; i < NUM_MBYTES; i += 1) {
  const blockLength = Math.floor(800 + Math.random() * 200);
  const character = i % 2 === 0 ? 'a' : 'b';

  ws.write(character.repeat(1024 * blockLength));

  numBlockPerCharacter[character] += 1;
}

console.log(numBlockPerCharacter);
