console.log(x); // undefined
var x = 1;

console.log(foo());
function foo() {
  return 'foo';
}

console.log(y); // error!
let y = 1;
