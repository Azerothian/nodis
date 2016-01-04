//import "babel-polyfill";
import ReadWriteLock from "rwlock";
import immutable from "immutable";
import Promise from "bluebird";
// Promise.promisifyAll(ReadWriteLock.prototype);

export default class Nodis {
  constructor() {
    this.context = immutable.Map({}); //eslint-disable-line
    this.lock = new ReadWriteLock();
  }
  write(func) {
    return new Promise((resolve, reject) => {
      return this.lock.readLock((releaseRead) => {
        let result = func();
        if (!immutable.is(result, this.context)) {
          return this.lock.writeLock((releaseWrite) => {
            this.context = result;
            releaseWrite()
            return resolve()
          });
        } else {
          releaseRead();
          return resolve();
        }
      });
    });
  }
  read(func) {
    return new Promise((resolve, reject) => {
      this.lock.readLock((release) => {
        let val = func();
        release();
        return resolve(val);
      });
    });
  }
  get(keyPath) {
    return this.read(() => {
      return this.context.getIn(keyPath);
    });
  }
  has(keyPath) {
    return this.read(() => {
      return this.context.hasIn(keyPath);
    });
  }
  set(keyPath, value) {
    return this.write(() => {
      return this.context.setIn(keyPath, value);
    });
  }
  del(keyPath, value) {
    return this.write(() => {
      return this.context.deleteIn(keyPath, value);
    });
  }
  incrby(keyPath, value = 1) {
    return this.write(() => {
      return this.context.updateIn(keyPath, 0, (val) => val + value);
    });
  }
}
