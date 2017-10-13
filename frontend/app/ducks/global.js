import _ from 'lodash';

const BULK_LOAD = 'BULK_LOAD';
const BULK_LOADING = 'BULK_LOADING';
const BULK_LOADED = 'BULK_LOADED';
const BULK_LOAD_FAILED = 'BULK_LOAD_FAILED';

const normalizeBulkParts = ['users', 'tags'];

export const isGlobalAction = action =>
  [BULK_LOADING, BULK_LOADED, BULK_LOAD_FAILED].includes(action.type);

export default function reducer(state = {}, action) {
  switch (action.type) {
    case BULK_LOADING:
      return { ...state, app: { appLoading: true } };
    case BULK_LOADED: {
      const normalized = normalizeBulkParts.reduce((acc, key) => {
        acc[key] = {
          ids: action.result[key].map(item => item.id),
          entities: _.keyBy(action.result[key], 'id')
        };
        return acc;
      }, {});

      return { ...state, ...normalized, app: { appLoading: false } };
    }
    default:
      return state;
  }
}

export const actions = {
  bulkLoad() {
    return {
      type: BULK_LOAD,
      types: [BULK_LOADING, BULK_LOADED, BULK_LOAD_FAILED],
      callApi: client => client.get('/bulk'),
    };
  }
};
