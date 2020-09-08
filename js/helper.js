/*
 * @Author: ADI
 * @Date: 2020-07-07 16:36:19
 * @LastEditors: ADI
 * @LastEditTime: 2020-09-08 15:53:10
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 */
export function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    writable: true,
    value: val,
    configurable: true,
    enumerable: !!enumerable
  });
}

export function hasOwn(value, key) {
  return value.hasOwnProperty(key);
}
