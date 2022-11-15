function Person(name) {
  this.name = name;
}

Person.prototype.greet = function greet() {
  return `Hi ${this.name}`;
};

function Student(name) {
  this.__proto__.constructor(name);
}

Student.prototype.study = function study() {
  return `${this.name} is studing`;
};

Object.setPrototypeOf(Student.prototype, Person.prototype);

const me = new Student('Haesol');
console.log(me.greet());
console.log(me.study());

console.log(me instanceof Person);

console.log([] instanceof Array, [] instanceof Object);
