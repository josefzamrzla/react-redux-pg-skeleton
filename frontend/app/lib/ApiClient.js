import superagent from 'superagent';
import PropTypes from 'prop-types';
import noop from 'lib/noop';
import config from '../config';

export const methods = ['get', 'post', 'put', 'patch', 'delete'];

export const propTypes = PropTypes.shape(methods.concat(['setToken', 'setSocketId', 'addErrorCallback']).reduce((acc, curr) => {
  acc[curr] = PropTypes.func.isRequired;
  return acc;
}, {}));

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;

  return `http://${config.apiHost}:${config.apiPort}${adjustedPath}`;
}

class ApiClient {
  _onErrorCbs = [];
  _token = null;
  _socketId = null;

  constructor() {
    this._onErrorCbs = [];
    this._token = null;
    this._socketId = null;

    methods.forEach((method) => {
      this[method] = (path, data = {}, params = {}, files = [], progressCallback = noop, abortCallback = null) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));
        if (abortCallback !== null) {
          abortCallback(request.abort.bind(request));
        }

        if (method === 'get' && data.io) {
          request.query({ ...params, socketId: this._socketId });
        } else {
          request.query(params);
        }

        if (this._token) {
          request.set('Authorization', `Bearer ${this._token}`);
        }

        if (files.length > 0) {
          files.forEach((file) => {
            if (file.name && file.file) {
              request.attach(file.name, file.file);
            } else {
              console.error('Invalid format for file {name, file}', file); // eslint-disable-line
            }
          });

          Object.keys(data).forEach(key => request.field(key, JSON.stringify(data[key])));
          request.field('socketId', JSON.stringify(this._socketId));
          request.on('progress', progressCallback);
        } else {
          request.send({ ...data, socketId: this._socketId });
        }

        request.end((err, { body } = {}) => {
          if (err) {
            this._onErrorCbs.forEach(cb => cb(body || err));
            return reject(body || err);
          }

          return resolve(body);
        });
      });
    });
  }

  setToken = (token) => {
    this._token = token;
    return this;
  };

  setSocketId = (socketId) => {
    this._socketId = socketId;
    return this;
  };

  addErrorCallback = (cb) => {
    this._onErrorCbs.push(cb);
  };
}

export default new ApiClient();
