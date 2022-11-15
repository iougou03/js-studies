// @ts-check

/**
 * definition can only once
 */
// @ts-ignore
let x = 1;
// let x = 2 // error!

/**
 * block scoping
 */
var a = 1;
{
  var a = 2;
  console.log(a); // 2
}
console.log(a); // 2

const b = 1;
{
  const b = 2;
  console.log(b); // 2
}
console.log(b); // 1

/**
 * spread operator
 */

const user = {
  nickname: 'JH',
  age: 22,
  email: 'haesol@naver.com',
};

const { nickname, ...personInfo } = user;
console.log(personInfo.age, personInfo.email);

const overrides = {
  email: 'over@gmail.com',
};

let shouldOverride = true;

const user2 = {
  ...user,
  ...(shouldOverride ? overrides : {}),
};

console.log(user2); // { nickname: 'JH', age: 22, email: 'over@gmail.com' }

/**
 * @param {number} head
 * @param {number[]} rest
 */
function spread(head, ...rest) {
  console.log(rest);
}

spread(1, 2, 3, 4, 5, 6);
