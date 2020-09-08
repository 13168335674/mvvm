/*
 * @Author: ADI
 * @Date: 2020-07-08 17:42:46
 * @LastEditors: ADI
 * @LastEditTime: 2020-09-08 16:01:09
 */
import { hasOwn } from "./helper";

export function del(target, key) {
  if (typeof target !== "object") {
    return;
  }
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return;
  }
  const ob = target.__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    throw Error(
      "Avoid deleting properties on a Vue instance or its root $data " +
        "- just set it to null."
    );
  }
  // 如果属性不在对象上, 不做处理
  if (!hasOwn(target, key)) {
    return;
  }
  delete target[key];
  // 不是响应式数据
  if (!ob) {
    return;
  }
  // 触发通知
  ob.dep.notify();
}
