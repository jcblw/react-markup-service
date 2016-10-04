const router = require('./router');
const express = require('express');
const morgan = require('morgan');

const onPortReady = (port, callback) => () => {
  console.log(`server is listening on ${port}`);
  if (typeof callback === 'function') {
    callback();
  }
};


const createServer = (port, options = {}, callback) => {
  const server = options.server || express();
  const logger = morgan('combined');

  if (options.onServiceRequest) {
    server.use(options.onServiceRequest);
  }
  server.use(logger);
  server.use(options.apiBase || '', router(options));

  return server.listen(port, onPortReady(port, callback));
};

module.exports = { createServer, onPortReady };
