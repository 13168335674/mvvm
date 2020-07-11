# 项目说明

通过阅读 vue 源码来学习如何写一个 MVVM 框架。

# why?

1、学习 vue 的双向数据绑定原理以及核心代码模块
2、缓解好奇心的同时了解如何实现 vue

# 进展

- [x] 监听对象变化
- [x] 监听数组变化
- [x] v-on 事件绑定
- [x] v-model 双向数据绑定
- [x] 实现 \$del
- [x] 实现 \$set
- [x] 实现 \$nextTick

# 如何启动

```
yarn global add live-server

live-server
```

# [DEMO](https://13189449986.github.io/mvvm/)

![demo.png](https://upload-images.jianshu.io/upload_images/4985324-b84236f5a9ea26ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 推荐资料

- [vue 源码查看工具](https://sourcegraph.com/github.com/vuejs/vue@dev/-/tree/src/core/instance)
- [observer 分析](https://github.com/creeperyang/blog/issues/45)
- [vue 技术揭秘(电子书)](https://ustbhuangyi.github.io/vue-analysis/)
- [vue 源码分析](https://github.com/NuoHui/fe-note/tree/master/docs/vue)
- [简版 mvvm(github)](https://github.com/DMQ/mvvm)

# 彩蛋

## vue(v3) Proxy 实现数据监听

```js
const rawToReactive = new WeakMap();
const reactiveToRaw = new WeakMap();

/**
 * utils
 * */
function isObject(val) {
  return typeof val === "object";
}
function hasOwn(val, key) {
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  return hasOwnProperty.call(val, key);
}

/**
 * traps
 * */
// get
function createGetter() {
  return function (target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    return isObject(res) ? reactive(res) : res;
  };
}
// set
function set(target, key, value, receiver) {
  const hadKey = hasOwn(target, key);
  const oldValue = target[key];
  value = reactiveToRaw.get(value) || value;
  const res = Reflect.set(target, key, value, receiver);
  if (!hadKey || value !== oldValue) {
    console.log("tigger...");
  }
  return res;
}
// handle
const mutableHandlers = {
  get: createGetter(),
  set: set,
};
// create reactive object
function createReactiveObject(target, toProxy, toRaw, baseHandlers) {
  let observed = toProxy.get(target);
  // target 生成过 observed，返回 observed
  if (observed !== void 0) {
    return observed;
  }
  // target 是 observed, 返回 target
  if (toRaw.has(target)) {
    return target;
  }
  observed = new Proxy(target, baseHandlers);
  toProxy.set(target, observed);
  toRaw.set(observed, target);
  return observed;
}
// enter
function reactive(target) {
  return createReactiveObject(
    target,
    rawToReactive,
    reactiveToRaw,
    mutableHandlers
  );
}
```

> so easy ~ 看完了记得去敲一敲 ya !
