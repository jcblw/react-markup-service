const React = require('react');

const Test = (props) => {
  const foo = props.foo;
  return React.createElement('div', {}, foo);
};

Test.propTypes = {
  foo: React.PropTypes.string,
};

module.exports = (props) => React.createElement(Test, props);
