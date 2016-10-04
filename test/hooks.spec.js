const assert = require('assert');
const path = require('path');
const hooks = require('../src/hooks');
const testHooks = require('./scaffold/test-hooks');

describe('the hooks module', () => {
  it('should export out a function', () => {
    assert.equal(typeof hooks, 'function', 'the hooks mdule exports a function');
  });
  describe('the hooks function', () => {
    it('should return the defaults when called with no params', () => {
      assert.deepEqual(hooks(), hooks.defaults, 'the returned object is all defaults');
    });
    it('should return the defaults when called with a bad path', () => {
      assert.deepEqual(hooks('foo/bar'), hooks.defaults, 'the returned object is all defaults');
    });
    it(
      'should set the methods on the return object if it is passed a path to a hooks file',
      () => {
        assert.equal(
          hooks(path.resolve(process.cwd(), './test/scaffold/test-hooks')).beforeServiceStarts,
          testHooks.beforeServiceStarts,
          'the returned object has the correct method set on it'
        );
      }
    );
    describe('the hooks functions defaults', () => {
      const { defaults } = hooks;
      defaults.onServiceRequest({}, {}, () => {});
      it(
        'should have a method called beforeServiceStarts that called a method passed to it',
        (done) => {
          defaults.beforeServiceStarts(() => {
            assert(true, 'the callback was called');
            done();
          });
        }
      );
      it(
        'should have a method called afterServiceHasStarted',
        () => {
          assert.equal(
            typeof defaults.afterServiceHasStarted,
            'function',
            'the method is a function'
          );
          assert.equal(defaults.afterServiceHasStarted(), undefined, 'the return is undefined');
        }
      );
      it(
        `should have a method called beforeServiceStarts that calls the
         third argument method passed to it`,
        (done) => {
          defaults.onServiceRequest(null, null, () => {
            assert(true, 'the callback was called');
            done();
          });
        }
      );
      it(
        'should have a method called onError that throws an error',
        () => {
          const err = new Error('foo bar');
          assert.throws(() => defaults.onError(err), /foo bar/, 'The error was thrown');
        }
      );
      it(
        'should have a method called decorateComponent that return the first argument',
        () => {
          assert.equal(
            defaults.decorateComponent('foo'),
            'foo',
            'the first argument is returned'
          );
        }
      );
    });
  });
});
