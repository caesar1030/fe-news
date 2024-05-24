let currentObserver = [];

export const observe = (fn) => {
  currentObserver.push(fn);
  fn();
  currentObserver.pop();
};

export const observable = (obj) => {
  Object.keys(obj).forEach((key) => {
    let _value = obj[key];
    const observers = new Set();
    const registery = new FinalizationRegistry((ref) => {
      this.observers.delete(ref);
    });

    Object.defineProperty(obj, key, {
      get() {
        if (currentObserver.length) {
          const observer = currentObserver[currentObserver.length - 1];
          const ref = new WeakRef(observer);
          observers.add(ref);
          registery.register(observer, ref, ref);
        }

        return _value;
      },
      set(value) {
        if (_value === value) return;
        if (JSON.stringify(_value) === JSON.stringify(value)) return;
        _value = value;
        console.log(obj, observers.size);
        observers.forEach((observer) => observer.deref()?.());
      },
    });
  });

  return obj;
};
