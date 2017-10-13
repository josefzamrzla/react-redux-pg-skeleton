import { v4 } from 'uuid';

const HIDE_ALERT = 'HIDE_ALERT';
const ADD_ALERT = 'ADD_ALERT';

export default function reducer(state = [], action) {
  switch (action.type) {
    case ADD_ALERT:
      if (action.payload.unique === true && state.find(alert =>
        alert.message === action.payload.message && alert.alertType === action.payload.alertType) !== undefined) {
        return state;
      }

      return [...state, { ...action.payload }];
    case HIDE_ALERT:
      return state.filter(alert => alert.id !== action.payload.id);
    default:
      return state;
  }
}

export const actions = {
  addAlert(message, alertType = 'danger', unique = true) {
    return {
      type: ADD_ALERT,
      payload: {
        id: v4(),
        message,
        alertType,
        unique
      }
    };
  },
  hideAlert(id) {
    return {
      type: HIDE_ALERT,
      payload: {
        id
      }
    };
  },
  createAlertFromError(error = {}) {
    return actions.addAlert(error.error || error.message || 'Unknown error');
  }
};
