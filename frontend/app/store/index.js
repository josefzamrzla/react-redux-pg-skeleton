import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from 'rootReducer';
import apiMiddleware from 'middleware/apiMiddleware';
import authMiddleware from 'middleware/authMiddleware';
import logEnvs from 'lib/logEnvs';

logEnvs('isomorphic');

export const history = createHistory();

export default function (initialState) {
  let finalCreateStore;
  if (process.env.NODE_ENV === 'production') {
    finalCreateStore = compose(
      applyMiddleware(apiMiddleware, thunk, authMiddleware, routerMiddleware(history))
    )(createStore);
  } else {
    const logger = createLogger();
    const enhancer = __CLIENT__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
    finalCreateStore = enhancer(
      // Middleware you want to use in development:
      applyMiddleware(apiMiddleware, logger, thunk, authMiddleware, routerMiddleware(history))
    )(createStore);
  }

  const store = finalCreateStore(rootReducer, initialState);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('rootReducer', () =>
      store.replaceReducer(require('rootReducer').default) // eslint-disable-line global-require
    );
  }

  return store;
}
