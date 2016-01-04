"use strict";

var _expect = require("expect");

var _expect2 = _interopRequireDefault(_expect);

var _index = require("../index");

var _index2 = _interopRequireDefault(_index);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import deepFreeze from "deep-freeze";

describe("index test", function () {
  it("basic get set test", function () {
    var repo = new _index2.default();
    repo.set(["test"], true).then(function () {
      return repo.get(["test"]);
    }).then(function (result) {
      (0, _expect2.default)(result).toEqual(true);
    });
  });
  it("basic incrby test", function () {
    var repo = new _index2.default();
    repo.set(["test"], 5).then(function () {
      return _bluebird2.default.all([repo.incrby(["test"], 5), repo.incrby(["test"], 1), repo.incrby(["test"], -4), repo.incrby(["test"], 2), repo.incrby(["test"], 2)]).then(function () {
        return repo.get(["test"]);
      });
    }).then(function (result) {
      (0, _expect2.default)(result).toEqual(11);
    });
  });
  it("basic bind context test", function () {
    var repo = new _index2.default();
    function hook() {
      repo.set(["test"], true).then(function () {
        return repo.get(["test"]);
      }).then(function (result) {
        (0, _expect2.default)(result).toEqual(true);
      });
    }
    hook.bind({});
  });
});