import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'jquery/src/jquery'; // todo: fujfuj, prototype only
import 'bootstrap/dist/js/bootstrap'; // todo: fujfuj, prototype only
import 'font-awesome/css/font-awesome.css';
import 'main.css';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import logEnvs from 'lib/logEnvs';
import createStore, { history } from 'store';
import { actions as globalActions } from 'ducks/global';
import { actions as authActions } from 'ducks/auth';
import apiClient from 'lib/ApiClient';
import App from 'components/App';

logEnvs('client');

const initialState = {};

try {
  const authState = localStorage.getItem('auth');
  if (authState !== null) {
    initialState.auth = JSON.parse(authState);
    apiClient.setToken(authState.token);
  }
} catch (e) {
  delete initialState.auth;
}

const store = createStore(initialState);

if (__DEVELOPMENT__) {
  window.store = store;
}

apiClient.addErrorCallback((error = {}) => {
  if (error.status === 401) {
    store.dispatch(authActions.forceLogout());
  }
});

if (initialState.auth) {
  store.dispatch(globalActions.bulkLoad());
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
