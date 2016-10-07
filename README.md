# React markup service

[![CircleCI](https://img.shields.io/circleci/project/RadPad/react-markup-service/master.svg)](https://circleci.com/gh/RadPad/react-markup-service/tree/master)

> Currently only supports node 6+

*React markup service* is a executable that will run an api to request markup for react components.

Server side rendering React components sometimes can be tricky when your backend architecture is something other than NodeJS. Luckily there is a few solutions for this, like [react-stdio](https://github.com/mjackson/react-stdio), but sometimes this can be slow as well. Spawning external processes and starting up a node process can be a bottle neck. This instead of spawning an external process each time we need new markup we just starts up a server that serves an api for the markup. `react-markup-service` allows you to do this as close or far away from the application as you like.

#### Examples

- from a python app (coming soon)
- as a standalone app (coming soon)

### Install

```shell
npm install react-markup-service
```
### Running

The service needs to run in the root of your project. The project can be any structure, it just needs to have react components somewhere in the file directory.

Installing the package gives you access to the `react-markup-service` executable. The only option currently is `--hooks` which points towards your hooks file.

```shell
react-markup-service --hooks='./path-to/foo'
```

#### Configuration Hooks

The way to configure the service is to write a *hooks* file. This allows you to hook into the functionality of the service.

```javascript
// example hook file
module.exports = {
  beforeServiceStarts(done) { done(); },
  afterServiceHasStarted() {},
  onServiceRequest(x, y, next) { next(); },
  onError(err) { throw err; },
  decorateComponent(x) { return x; },
}
```

##### beforeServiceStarts

*beforeServiceStarts* is a great way to precompile your components or load up any configuration needed for  you components to render. The `beforeServiceStarts` method will be passed a `done` function to be called when the method is _done_. By passing options to the done function you can configure the service.

```javascript
const options = {};
...
  beforeServiceStarts(done) {
    exec('npm run compile', () => {
      done(options);
    });
  }
...
```

*options*

| option key  | description                                                                                                                             | type   | defaults         |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------|--------|------------------|
| port        | the port that the service will listen on                                                                                                | number | 5000             |
| server      | a server object, currently this is expecting a express server with middleware capabilities.                                             | object | express()        |
| apiBase     | the base for the api to be set at, eg. `/api/` would put the render endpoint at `/api/render`                                           | string | ''               |
| router      | a router object, currently this is a express.Router object wanted                                                                       | object | express.Router() |
| compiledDir | the path to the root of the compiled javascript, this will allow you to shorten your paths to components when making a post to the api. | string | './compiled'     |

##### afterServiceHasStarted

`afterServiceHasStarted` hook is a way you could signal other apps to let them know the service is ready to use.

```javascript
...
  afterServiceHasStarted() {
    // service is ready
  }
...
```

##### onServiceRequest

`onServiceRequest` is a piece of middleware. It will allow you to setup custom logging, or authenticate request to the service.

```javascript
...
  onServiceRequest(req, res, next) {
    next();
  }
...
```

##### decorateComponent

`decorateComponent` allows you to render out your component, with things like a `react-redux` *Provider*.

```javascript
...
  decorateComponent(Component, props) {
    return React.createElement(Provider, {store: configStore(props)},
      React.createElement(Component)
    );
  }
...
```

#### Api Interface

the api consist of mainly on endpoint `/render`, render is a `POST` endpoint, and wants a json object as the post body. The post body is the `props` of the request. You also need to set a `component` key in the body.

```shell
curl -X POST -d '{"component": "./foo-component.js"}' http://localhost:5000/render
```

There is also an alive router, may be tmp, to check if the service is alive.

```shell
curl http://localhost:5000/alive
```

### Contributing

We use eslint please follow it. and plz run `npm test`!
