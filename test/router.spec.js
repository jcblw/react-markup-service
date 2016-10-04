const assert = require('assert');
const router = require('../src/router');
const React = require('react');

function chain() { return this; }

describe('the router module', () => {
  it('should export out a function', () => {
    assert.equal(typeof router, 'function', 'the main export is a function');
  });
  it('should return a function', () => {
    assert.equal(typeof router(), 'function', 'the function returns an object');
  });
  describe('the returned router', () => {
    it('should attach a piece of middleware to the router', (done) => {
      router({
        router: {
          get: chain,
          post: chain,
          use: (middleware) => {
            assert.equal(typeof middleware, 'function', 'middleware is a function');
            assert.equal(middleware.name, 'jsonParser', 'the middleware is a json parser');
            done();
          },
        },
      });
    });
    it('should attach some paths to "get" method', () => {
      router({
        router: {
          use: chain,
          post: chain,
          get: (path, handler) => {
            assert.equal(typeof path, 'string', 'the path is a string');
            if (path === '/') {
              // testing handler resp
              handler(null, {
                status: chain,
                end: (foo) => {
                  assert.equal(typeof foo, 'string', 'the response is a string');
                  assert.equal(foo, '~(=^‥^)_旦~ < ssr tea time?', 'the expected reponse is given');
                },
              });
            }
            if (path === '/alive') {
              // testing handler resp
              handler(null, {
                status: chain,
                end: (foo) => {
                  assert.equal(typeof foo, 'string', 'the response is a string');
                  assert.equal(foo, 'alive', 'the expected reponse is given');
                },
              });
            }
          },
        },
      });
    });
    it('should attach a path to "post" method', () => {
      router({
        decorateComponent(x, props) { return React.createElement(x, props); },
        compiledDir: './test/scaffold/',
        router: {
          use: chain,
          get: chain,
          post: (path, handler) => {
            assert.equal(typeof path, 'string', 'the path is a string');
            assert.equal(path, '/render', 'the expected path is passed');
            handler({
              params: { id: 'test-component' },
              body: { foo: 'baz', component: 'test-component' },
            }, {
              status: chain,
              header: (headerType, value) => {
                assert.equal(headerType, 'Content-Type', 'the content type header is being set');
                assert.equal(
                  value,
                  'text/html; charset=utf-8', 'the content type is set to html utf8'
                );
              },
              send: (foo) => {
                assert.equal(typeof foo, 'string', 'the response sent is a string');
                assert(foo.match(/div/g), 'the reponse has a div');
                assert(foo.match(/baz/g), 'the reponse has data from the body passed into it');
              },
            });
          },
        },
      });
      it(
        'should attach a path to "post" method and return a 400 if no component param is passed',
        (done) => {
          router({
            decorateComponent(x, props) { return React.createElement(x, props); },
            compiledDir: './foo',
            router: {
              use: chain,
              get: chain,
              post: (path, handler) => {
                assert.equal(typeof path, 'string', 'the path is a string');
                assert.equal(path, '/render', 'the expected path is passed');
                handler({
                  params: { id: 'test-component' },
                  body: { foo: 'baz' },
                }, {
                  status: function handle(status) {
                    assert.equal(
                      status,
                      500,
                      'the status is 400 if no component is passed in the body'
                    );
                  },
                  header: () => {},
                  send: (body) => {
                    console.log(body);
                    assert(
                      body.match(/component/g),
                      'the reponse is a message about not having a component'
                    );
                    done();
                  },
                });
              },
            },
          });
        }
      );
    });
  });
});
