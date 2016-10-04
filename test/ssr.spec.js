const assert = require('assert');
const React = require('react');
const ssr = require('../src/ssr');

describe('the ssr module', () => {
  it('should export a function', () => {
    assert.equal(typeof ssr, 'function', 'the ssr export is a function');
  });
  it('should return a function', () => {
    assert.equal(typeof ssr(), 'function', 'the ssr function returns a function');
  });
  describe('the returned function from ssr', () => {
    const foo = ssr({
      decorateComponent(x, props) { return React.createElement(x, props); },
    });
    it('should return a object', () => {
      const error = foo('./src/', 'router');
      assert.equal(typeof error, 'object', 'the return from function is object');
      assert.equal(
        typeof error.message,
        'string',
        'the object returned should have a string message key'
      );
      assert.equal(
        typeof error.stack,
        'string',
        'the object returned should have a string stack key'
      );
    });
    it('should require in a react component and return the rendered string', () => {
      const output = foo('./test/scaffold/', 'test-component', { foo: 'bar' });
      assert.equal(typeof output, 'string', 'the return is a string');
      assert(!!output.match(/div/g), 'The output has a div');
      assert(!!output.match(/bar/g), 'The output has the content from props included');
    });
  });
});
