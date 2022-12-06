export function sum(arr) {
  return arr.reduce((acc, cur) => acc + cur, 0);
}
export function range(num) {
  return [...Array(num).keys()];
}
