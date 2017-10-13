import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import globalReducer, { isGlobalAction } from 'ducks/global';
import app from 'ducks/app';
import alerts from 'ducks/alert';
import auth from 'ducks/auth';

const reducers = combineReducers({
  app,
  alerts,
  auth,
  routing: routerReducer,
});

export default function (state, action) {
  if (isGlobalAction(action)) {
    return globalReducer(state, action);
  }

  return reducers(state, action);
}
