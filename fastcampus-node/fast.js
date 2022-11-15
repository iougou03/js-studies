'use strict'

const fs = require('fs');
const { promisify } = require('util')

const obj = {
  title: 'node.js',
  value: 'all in one package'
}

const arr = [1,2,3]
const { title, value } = obj;

const [, a2, a3] = arr;

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

const writeAndRead = async (data = '') => {
  try {
    await write('test.txt', data);
    return read('test.txt', 'utf-8');
  } catch (error) {
    console.error(error);
  }
}

writeAndRead('Hello World!').then(content=>{
  console.log(content)
});

const promise1 = new Promise((res, rej) => {
  setTimeout(() => res('api1 complete'), 5000)
});
const promise2 = new Promise((res, rej) => {
  setTimeout(() => res('api2 complete'), 3000)
});

(async () => {
  await Promise.all([promise1, promise2]).then(val => console.log(val))

  Promise.race([promise2, promise1]).then(val => console.log(val))
})()

function fullstackPrototype (backend, frontend) {
  this.backend = backend;
  this.frontend = frontend;

  fullstack.prototype.getBackend = () => this.backend;
  fullstack.prototype.setBackend = () => this.backend = backend;

  fullstack.prototype.getFrontend = () => this.frontend;
  fullstack.prototype.setFrontend = () => this.frontend = frontend;
}

class fullstackClass {
  constructor (backend, frontend) {
    this.backend = backend;
    this.frontend = frontend;
  }

  getFrontend() {

  }

  setFrontend() {
    
  }
}
const fs = new fullstack('javascript', 'javascript');