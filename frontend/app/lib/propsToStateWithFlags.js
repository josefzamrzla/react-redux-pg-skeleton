import noop from 'lib/noop';

export default (stateKey, mapStateToPropsFn = noop) => (...args) => ({
  ...mapStateToPropsFn.apply(mapStateToPropsFn, args),
  loading: args[0][stateKey] && args[0][stateKey].loading,
  submitting: args[0][stateKey] && args[0][stateKey].submitting
});
