function adiMvvm({ el, data, methods }) {
  const that = this;
  this.vm = this;
  this.data = typeof data === "function" ? data.call(this) : data || {};
  this.methods = methods;
  observe(this.data);
  this.proxyKeys();
  new Compile(el, this);
  return this;
}
adiMvvm.prototype = {
  proxyKeys() {
    const that = this;
    Object.keys(this.data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return that.data[key];
        },
        set(newValue) {
          that.data[key] = newValue;
        },
      });
    });
  },
  $del: del,
  $set: set,
};
