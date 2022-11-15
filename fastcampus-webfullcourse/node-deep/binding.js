// inner scope can access all resources from outer side but opposite can't valid
function outer() {
  let x1 = 1;

  function inner() {
    let x2 = 2;

    console.log(x1); // 1
  }

  inner();
  // console.log(x2); // error!
}

// bindExample.bind()
outer();

// var ignore for block scoping
var x1 = 1;
if (true) {
  var x1 = 2;
}
console.log(x1); // 2

let x2 = 1;
if (true) {
  let x2 = 2;
}
console.log(x2); // 1

// bind exaple
const moduleExam = {
  x: 42,
  getX: function () {
    return this.x;
  },
  getXArrow: () => {
    return this.x;
  },
};

const unboundGetX = moduleExam.getX;
const boundGetX = unboundGetX.bind(moduleExam);
const arrowGetX = moduleExam.getXArrow;

console.log(unboundGetX());

console.log(boundGetX());

console.log(arrowGetX());

const A = {
  print: function () {
    console.log(this);
  },
};

const callByGlobal = A.print;

callByGlobal();
A.print();
