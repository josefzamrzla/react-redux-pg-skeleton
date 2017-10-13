import apiClient from 'lib/ApiClient';
import { actions as authActions, LOGIN } from 'ducks/auth';

export default function ({ dispatch, getState }) {
  return next => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { callApi, type, types, onSuccess = [], onFailure = [], ...rest } = action;
    if (!callApi) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE, FINALLY] = types;
    if (REQUEST) {
      next({ ...rest, type: REQUEST });
    }

    const { auth = {} } = getState();

    return callApi(apiClient)
      .then(
        (result) => {
          if (SUCCESS) {
            next({ ...rest, result, type: SUCCESS });
          }

          onSuccess.forEach((succAction) => {
            const actionBody = (typeof succAction === 'function') ? succAction(result) : succAction;
            if (actionBody.callApi) {
              dispatch(actionBody);
            } else {
              next(actionBody);
            }
          });
        },
        (error) => {
          if (error.status === 401 && type !== LOGIN) {
            if (__DEVELOPMENT__) {
              console.error('HTTP 401 response from API', 'action', action, 'error', error, 'auth', auth); // eslint-disable-line
            }

            if (auth.loggedIn) {
              next(authActions.forceFogout());
            } else {
              next(authActions.logout());
            }
          } else {
            if (FAILURE) {
              next({ ...rest, error: error.error, type: FAILURE });
            }

            onFailure.forEach((failureAction) => {
              const actionBody = (typeof failureAction === 'function') ? failureAction(error) : failureAction;
              if (actionBody.callApi) {
                dispatch(actionBody);
              } else {
                next(actionBody);
              }
            });
          }
        }
      ).then(() => {
        if (FINALLY) {
          next({ ...rest, type: FINALLY });
        }
      })
      .catch((error) => {
        if (__DEVELOPMENT__) {
          console.error('API MIDDLEWARE ERROR', error, 'action', action); // eslint-disable-line
        }
        next({ ...rest, error, type: FAILURE });
      });
  };
}
