import expect from "expect";
//import deepFreeze from "deep-freeze";
import Nodis from "../index";
import Promise from "bluebird";


describe("index test", () => {
  it("basic get set test", () => {
    let repo = new Nodis();
    repo.set(["test"], true).then(() => {
      return repo.get(["test"]);
    }).then((result) => {
      expect(result).toEqual(true);
    });
  });
  it("basic incrby test", () => {
    let repo = new Nodis();
    repo.set(["test"], 5).then(() => {
      return Promise.all([
        repo.incrby(["test"], 5),
        repo.incrby(["test"], 1),
        repo.incrby(["test"], -4),
        repo.incrby(["test"], 2),
        repo.incrby(["test"], 2),
      ]).then(() => {
        return repo.get(["test"]);
      });
    }).then((result) => {
      expect(result).toEqual(11);
    });
  });
  it("basic bind context test", () => {
    let repo = new Nodis();
    function hook() {
      repo.set(["test"], true).then(() => {
        return repo.get(["test"]);
      }).then((result) => {
        expect(result).toEqual(true);
      });
    }
    hook.bind({});
  });
});
