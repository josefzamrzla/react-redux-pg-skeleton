import container from './init-container';

const config = container.get('config');
const app = container.get('app');

app.get('/favicon.ico', (req, res) => res.end());

// attach routes here, cannot register them in init-container because handlers could want to use app.io and it would cause circular deps
app.use('/', container.get('publicRoutes'));
app.use('/bulk', container.get('bulkRoutes'));

// common response handler
app.use((data, req, res, next) => {
  if (data instanceof Error) {
    return next(data);
  }

  return res.json(data);
});

app.use((err, req, res, next) => { // eslint-disable-line
  console.log('--- MAIN ERROR HANDLER ---'); // eslint-disable-line
  if (err.httpCode) {
    // custom error, status code must be repeated in JSON to be able to read it in redux middleware
    const errJson = { status: err.httpCode, error: err.message };
    console.log('Custom error', errJson); // eslint-disable-line
    console.error(err); // eslint-disable-line

    return res.status(err.httpCode).json(errJson);
  }

  // unknown runtime err, status code must be repeated in JSON to be able to read it in redux middleware
  console.error(err); // eslint-disable-line
  return res.status(500).json({ status: 500, error: config.isDeveloping ? err.message : 'Internal server error' });
});

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

app.listen(config.port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err); // eslint-disable-line
  }
  console.info('API server is listening on port %s.\n', config.port); // eslint-disable-line
});
