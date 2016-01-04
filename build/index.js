"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); //import "babel-polyfill";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rwlock = require("rwlock");

var _rwlock2 = _interopRequireDefault(_rwlock);

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Promise.promisifyAll(ReadWriteLock.prototype);

var Nodis = (function () {
  function Nodis() {
    _classCallCheck(this, Nodis);

    this.context = _immutable2.default.Map({}); //eslint-disable-line
    this.lock = new _rwlock2.default();
  }

  _createClass(Nodis, [{
    key: "write",
    value: function write(func) {
      var _this = this;

      return new _bluebird2.default(function (resolve, reject) {
        return _this.lock.readLock(function (releaseRead) {
          var result = func();
          if (!_immutable2.default.is(result, _this.context)) {
            return _this.lock.writeLock(function (releaseWrite) {
              _this.context = result;
              releaseWrite();
              return resolve();
            });
          } else {
            releaseRead();
            return resolve();
          }
        });
      });
    }
  }, {
    key: "read",
    value: function read(func) {
      var _this2 = this;

      return new _bluebird2.default(function (resolve, reject) {
        _this2.lock.readLock(function (release) {
          var val = func();
          release();
          return resolve(val);
        });
      });
    }
  }, {
    key: "get",
    value: function get(keyPath) {
      var _this3 = this;

      return this.read(function () {
        return _this3.context.getIn(keyPath);
      });
    }
  }, {
    key: "has",
    value: function has(keyPath) {
      var _this4 = this;

      return this.read(function () {
        return _this4.context.hasIn(keyPath);
      });
    }
  }, {
    key: "set",
    value: function set(keyPath, value) {
      var _this5 = this;

      return this.write(function () {
        return _this5.context.setIn(keyPath, value);
      });
    }
  }, {
    key: "del",
    value: function del(keyPath, value) {
      var _this6 = this;

      return this.write(function () {
        return _this6.context.deleteIn(keyPath, value);
      });
    }
  }, {
    key: "incrby",
    value: function incrby(keyPath) {
      var _this7 = this;

      var value = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      return this.write(function () {
        return _this7.context.updateIn(keyPath, 0, function (val) {
          return val + value;
        });
      });
    }
  }]);

  return Nodis;
})();

exports.default = Nodis;