let id = 0;
function Dep(key) {
  this.id = id++;
  this.name = key;
  this.subs = [];
}
Dep.prototype = {
  addSub(sub) {
    const idx = this.subs.findIndex((s) => s.uid === sub.uid);
    if (idx === -1) {
      this.subs.push(sub);
    }
  },
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  },
};
