export function encodeObject(object) {
  return encodeURIComponent(JSON.stringify(object));
}
export function decodeObject(stringified) {
  return JSON.parse(decodeURIComponent(stringified));
}