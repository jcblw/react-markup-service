const path = require('path');
const ReactDOMServer = require('react-dom/server');

module.exports = (options = {}) => {
  const { decorateComponent } = options;

  return (componentDir, componentFileName, props) => {
    const componentFile = path.resolve(
      componentDir || '',
      componentFileName || ''
    );
    let markup;

    // try to require the component file
    try {
      const Component = require(componentFile); // eslint-disable-line global-require
      if (typeof Component !== 'function') return '';
      const element = decorateComponent(Component, props);
      markup = ReactDOMServer.renderToStaticMarkup(element);
    } catch (e) {
      markup = null;
      return e;
    }
    return markup;
  };
};
