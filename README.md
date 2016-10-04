# React markup service

> Currently only supports node 6+

*React markup service* is a executable that will run an api to request markup for react components.

### Install

```shell
npm install react-markup-service
```

### Setup

The service needs to run in the root of your project. The project can be any structure, it just needs to have react components somewhere in the file directory.

### Running

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

### Contributing

We use eslint please follow it. and plz run `npm test`!
