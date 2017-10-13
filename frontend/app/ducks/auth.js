// import { actions as alert } from './alert';
import { push } from 'react-router-redux';

export const LOGIN = 'LOGIN';
const LOGIN_IN_PROGRESS = 'LOGIN_IN_PROGRESS';
export const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED';
const LOGIN_FAILED = 'LOGIN_FAILED';

export const LOGOUT = 'LOGOUT';
export const FORCE_LOGOUT = 'FORCE_LOGOUT';

const initialState = { loggingIn: false, loggedIn: false, user: {}, token: null, error: null };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_IN_PROGRESS:
      return { ...initialState, loggingIn: true };
    case LOGIN_SUCCEEDED:
      return { loggingIn: false, loggedIn: true, error: null, ...action.result };
    case LOGIN_FAILED:
      return { ...initialState, error: action.error };
    case LOGOUT:
    case FORCE_LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}

export const actions = {
  login(credentials = {}) {
    return {
      type: LOGIN,
      types: [LOGIN_IN_PROGRESS, LOGIN_SUCCEEDED, LOGIN_FAILED],
      callApi: client => client.post('/login', { input: credentials }),
      onSuccess: [push('/')]
      // onFailure: [alert.addAlert('login has failed')]
    };
  },

  logout() {
    return {
      type: LOGOUT
    };
  },
  forceLogout() {
    return {
      type: FORCE_LOGOUT
    };
  }
};
