/*
 * @Author: ADI
 * @Date: 2020-07-10 09:59:20
 * @LastEditors: ADI
 * @LastEditTime: 2020-07-10 16:54:46
 */
/**
 * utils
 */

const noop = (_) => _;
const callbacks = [];

let isUsingMicroTask = false;
let pending = false;
let timerFunc;

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

if (typeof Promise !== "undefined") {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    isUsingMicroTask = true;
    // if (isIOS) setTimeout(noop)
  };
} else if (
  typeof MutationObserver !== "undefined" &&
  MutationObserver.toString() === "[object MutationObserverConstructor]"
) {
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== "undefined") {
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick(cb, ctx) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (error) {
        console.log("errors", errors);
      }
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
