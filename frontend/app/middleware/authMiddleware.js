import apiClient from 'lib/ApiClient';
import reducer, { LOGIN_SUCCEEDED, LOGOUT, FORCE_LOGOUT } from 'ducks/auth';
import { actions as globalActions } from 'ducks/global';

export default function ({ dispatch, getState }) {
  return next => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    if (action.type === LOGIN_SUCCEEDED) {
      const auth = reducer(null, action);
      apiClient.setToken(auth.token);
      localStorage.setItem('auth', JSON.stringify(auth));
      dispatch(globalActions.bulkLoad());
    }
    if (action.type === LOGOUT || action.type === FORCE_LOGOUT) {
      apiClient.setToken(null);
      localStorage.removeItem('auth');
    }

    return next(action);
  };
}
