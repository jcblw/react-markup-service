const express = require('express');
const parser = require('body-parser');
const ssr = require('./ssr');

const initialRouter = express.Router(); // eslint-disable-line new-cap

module.exports = (options = {}) => {
  const generateMarkup = ssr(options);
  const router = options.router || initialRouter;
  router.use(parser.json({ limit: '5mb' }));
  router.get('/', (req, res) => res.end('~(=^‥^)_旦~ < ssr tea time?'));
  router.get('/alive', (req, res) => res.end('alive'));
  router.post('/render', (req, res) => {
    if (!req.body.component) {
      res.status(400)
        .send('Unable to create markup without param "component"');
      return;
    }
    const html = generateMarkup(
      options.compiledDir || './compiled',
      req.body.component,
      req.body
    );
    if (typeof html === 'object' && html.message) {
      res.status(500)
        .send(html.message);
      return;
    }
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  });
  return router;
};
