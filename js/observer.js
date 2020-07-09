function Observer(data) {
  if (!data || typeof data !== "object") {
    return;
  }
  this.value = data;
  this.dep = new Dep(data);
  this.name = JSON.stringify(data);
  def(data, "__ob__", this);
  if (Array.isArray(data)) {
    data.__proto__ = createArrayPrototype();
    observerArray(data);
  } else {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

function observe(value) {
  if (typeof value !== "object") return;
  let ob;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
}

function defineReactive(data, key, val) {
  const dep = new Dep(key);
  let childOb = observe(val);
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      if (Dep.target) {
        dep.addSub(Dep.target);
        if (childOb) {
          childOb.dep.addSub(Dep.target);
          if (Array.isArray(val)) {
            dependArray(val);
          }
        }
      }
      return val;
    },
    set(newVal) {
      if (val === newVal) return;
      val = newVal;
      observe(val);
      dep.notify();
    },
  });
}

// 监听数组
function observerArray(inserted) {
  for (let i = 0; i < inserted.length; i++) {
    observe(inserted[i]);
  }
}

function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

// 修改数组原型
function createArrayPrototype() {
  const arrayProto = Array.prototype;
  const arrayMethods = Object.create(arrayProto);
  const methodsToPatch = [
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "sort",
    "reverse",
  ];
  methodsToPatch.forEach((method) => {
    const oriiginal = arrayProto[method];
    def(arrayMethods, method, function mutator(...args) {
      const result = oriiginal.apply(this, args);
      const ob = this.__ob__;
      let inserted;
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.slice(2);
          break;
      }
      if (inserted) observerArray(inserted);
      ob.dep.notify();
      return result;
    });
  });
  return arrayMethods;
}
