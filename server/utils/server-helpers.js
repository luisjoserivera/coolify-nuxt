/**
 *
 * @param {*} promise
 * @returns
 */
export function sureThing(promise) {
  return promise
    .then((data) => [data, undefined])
    .catch((error) => Promise.resolve([null, error]));
}
