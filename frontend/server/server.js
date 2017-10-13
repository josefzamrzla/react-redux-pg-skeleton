import path from 'path';
import express from 'express';
import http from 'http';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import logEnvs from 'lib/logEnvs';
import webpackConfig from '../webpack.config';

logEnvs('BFF server');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = express();
const server = new http.Server(app);

app.get('/*/bootstrap-theme.css.map', (req, res) => {
  res.redirect('/bootstrap-theme.css.map');
});
app.get('/*/bootstrap.css.map', (req, res) => {
  res.redirect('/bootstrap.css.map');
});

if (isDeveloping) {
  const compiler = webpack(webpackConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.join(__dirname, '../static')));
  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

server.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err); // eslint-disable-line
  }
  console.info('BFF server is listening on port %s. Open up http://0.0.0.0:%s/ in your browser.\n', port, port); // eslint-disable-line
});
