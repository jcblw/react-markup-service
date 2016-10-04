const assert = require('assert');
const server = require('../src/server');

describe('the server module', () => {
  it('should export out a object', () => {
    assert.equal(typeof server, 'object', 'the main export of the server is a object');
    assert.equal(typeof server.createServer, 'function', 'the method createServer is a function');
  });
  describe('the create server method', () => {
    it('should create a server if no server is passed', (done) => {
      const foo = server.createServer(9999);
      const ogLog = console.log;
      console.log = (baz) => {
        console.log = ogLog;
        assert.equal(!!baz.match(new RegExp('9999')), true, 'the correct port is logged');
        foo.close();
        done();
      };
    });
  });
  describe('the onPortReady method', () => {
    it('should be a function', () => {
      assert.equal(typeof server.onPortReady, 'function', 'the method is a function');
    });
    it('should return a function', () => {
      assert.equal(typeof server.onPortReady(), 'function', 'the return is a function');
    });
    it('should log out the port passed to the method in the first param', (done) => {
      const ogLog = console.log;
      const port = 5555;
      console.log = (foo) => {
        console.log = ogLog;
        assert.equal(!!foo.match(new RegExp(`${port}`)), true, 'the correct port is logged');
        done();
      };
      server.onPortReady(port)();
    });
    it('should call the callback passed to the method in the second param', (done) => {
      const port = 'test';
      server.onPortReady(port, () => {
        assert(true, 'the callback was called');
        done();
      })();
    });
  });
});
