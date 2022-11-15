'use strict'

function praticeSet() {
  const test = new Set();

  test.add(1)
  test.add(1)
  test.add(1)
  test.add(2)

  for (const item of test) {
    console.log(`${item}`);
  }

  if (test.has(2)) console.log("get two")
}

function practiceSome() {
  const arr1 = [0, -2, -1]
  const arr2 = [1, -2, -1]

  console.log(arr1.some(key=> key == 0))
  console.log(arr2.some(key=> key == 0))
  console.log(arr2.every(key => key != 0))
}

function templateString(temStr) {

  console.log`
    you can pass template string as a parameter with no brackets\n
    ${temStr}
  `
}

function practiceString() {
  "string".startsWith('s'); // true

  "string".includes("str"); // true

  "string".endsWith("g"); // true
}

function typeChecking() {
  console.log(typeof 1) // number
  console.log(typeof {}) // object
  console.log(typeof []) // object
  console.log(typeof "str") // string
}

function hoisting() {
  /*
    함수를 선언하기 전에 호출할 수 있는 특징을 말함
    브라우저는 JS의 함수들을 선언하기도 전에 메모리에 미리 적재
      하는 특징이 있기 떄문에 가능하다. (단, let, const 변수는
        예외)
  */

  func();
  function func() {
    console.log("calling before the function defined!");
  }
  
  try {
    func2();

    const func2 = () => {
      console.log("this message won't appear");
    }
  } catch (err) {
    console.log("（；´д｀）ゞ ---(\'const\' variable doesn't have hoisting)");
  }
}

function IIFE() {
  let onlyGetResult = (()=> {
    return 1 + 1;
  })();

  console.log(onlyGetResult)
}

function arrowCurriedFunction() {
  const a = rate => price => rate * price;
  const b = a(0.1);
  /*
   합성함수를 만드는 것처럼 
  */
  b(1000); 
}

function practiceGenerator() {
  const obj = {
    *gen() {
      let cnt = 0;
      yield ++cnt;
      yield ++cnt;
      yield ++cnt;
      yield ++cnt;
    }
  }

  // 무조건 반환하는 형태로 작성 
  // const g = obj.gen -> (X)
  const g = obj.gen();

  console.log(g.next());
  console.log(g.next());
  console.log(g.next());
  console.log(g.next());
}

function practiceEventEmitter () {
  const EventEmitter = require('events');

  class ChatManager extends EventEmitter {

  }

  const chatManger = new ChatManager();

  chatManger.on('join', () => {

  })

  chatManger.emit('join');
}
function init() {
  // praticeSet();
  // practiceSome();
  // templateString`tem string`
  // typeChecking();
  // IIFE();
  // hoisting();
  practiceGenerator()
}

init();