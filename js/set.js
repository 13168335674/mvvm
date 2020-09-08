import { defineReactive } from "./observer";

export function set(target, key, val) {
  if (typeof target !== "object") {
    throw Error(
      `Cannot set reactive property on undefined, null, or primitive value: ${target}`
    );
  }
  if (Array.isArray(target)) {
    // 修改数组长度，避免索引大于数组长度导致splice()执行有误
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }
  const ob = target.__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    throw Error(
      "Avoid adding reactive properties to a Vue instance or its root $data " +
        "at runtime - declare it upfront in the data option."
    );
    return val;
  }
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}
