function and(x) {
  return function print(y) {
    return x + ' and ' + y;
  };
}

const saltAnd = and('salt');
console.log(saltAnd('pepper'));
console.log(saltAnd('wiper'));

const paperAnd = and('paper');
console.log(paperAnd('pen'));

// how many closure created?
function foo() {
  function bar() {}

  function bee() {}
}

foo(); // 3 (foo 1, bar 1, bee 1)
foo(); // 5 (foo 1, bar 2, bee 2)

let globalClosure = 0;

function getCounter() {
  globalClosure += 1;
  var result = {
    count: count,
    total: 0,
  };

  function count() {
    result.total += 1;
    console.log(this);
  }

  return result;
}

var counter = getCounter();
counter.count();
counter.count();

console.log(counter.total);

var counterB = getCounter();
counterB.count();

console.log(counter.total, counterB.total, globalClosure); // 2 1 2
