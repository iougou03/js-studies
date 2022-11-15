// @ts-check

// understanding call-stack
function f3() {
  console.log("I'm f3!");
}
function f2() {
  f3();
  console.log("I'm f2!");
}
function f1() {
  f2();
  console.log("I'm f1!");
}

f1();

/**
 * I'm f3!
 * I'm f2!
 * I'm f1!
 */

// unserstanding callback-queue
console.log('1');

// setTimeout is webAPI function so it won't put in call-stack at first
setTimeout(() => {
  console.log('2');
}, 0);

console.log('3');

// 3 1 2 (X) think about run-to-completion
// 1 3 2

// understanding browser's event loop and call stack
setInterval(() => {
  console.log('Hey!');

  while (true) {} // how many 'Hey!' should be print in 5 seconds?
}, 1000);

// approximately, <= 5 (X)
// 1 and *won't stop*
