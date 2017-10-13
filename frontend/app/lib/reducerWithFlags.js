export default (reducerFn, loadingTypes = [], submittingTypes = []) => (state, action) => {
  const nextState = reducerFn(state, action);
  switch (true) {
    case loadingTypes.includes(action.type):
      return { ...nextState, loading: true };
    case submittingTypes.includes(action.type):
      return { ...nextState, submitting: true };
    default:
      return { ...nextState, loading: false, submitting: false };
  }
};
