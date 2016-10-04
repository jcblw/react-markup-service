
const hookDefaults = {
  beforeServiceStarts(done) { done(); },
  afterServiceHasStarted() {},
  onServiceRequest(x, y, next) { next(); },
  onError(err) { throw err; },
  decorateComponent(x) { return x; },
};

function tryHooksFile(path) {
  let hooks;
  try {
    hooks = require(path); // eslint-disable-line
  } catch (err) {
    hooks = {};
  }
  return hooks;
}

function createHooks(hooks = {}) {
  return Object.assign({}, hookDefaults, hooks);
}

module.exports = (path) => createHooks(tryHooksFile(path));
module.exports.defaults = hookDefaults;
