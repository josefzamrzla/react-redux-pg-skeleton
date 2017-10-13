import { goBack, push, replace } from 'react-router-redux';

export const actions = {
  goBackOnSuccess(actionCreator) {
    return (...args) => {
      const actionBody = actionCreator.apply(actionCreator, args);
      actionBody.onSuccess = actionBody.onSuccess || [];
      actionBody.onSuccess.push(goBack());
      return actionBody;
    };
  },
  redirectOnSuccessUsingInput(actionCreator, linkMask, method = 'replace') {
    return (...args) => {
      const input = args[0] || {};
      const link = linkMask.replace(/:[^/]+/g, match => input[match.substring(1)]);
      const actionBody = actionCreator.apply(actionCreator, args);
      actionBody.onSuccess = actionBody.onSuccess || [];
      actionBody.onSuccess.push(method === 'replace' ? replace(link) : push(link));
      return actionBody;
    };
  },
  redirectOnSuccessUsingResult(actionCreator, linkMask, method = 'replace') {
    return (...args) => {
      const actionBody = actionCreator.apply(actionCreator, args);
      actionBody.onSuccess = actionBody.onSuccess || [];
      actionBody.onSuccess.push((result = {}) => {
        const link = linkMask.replace(/:[^/]+/g, match => result[match.substring(1)]);
        return method === 'replace' ? replace(link) : push(link);
      });
      return actionBody;
    };
  }
};

export default {};
