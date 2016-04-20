const LOAD = 'unbundling/LOAD';
const LOAD_SUCCESS = 'unbundling/LOAD_SUCCESS';
const LOAD_FAIL = 'unbundling/LOAD_FAIL';

const initialState = {
  loaded: false,
  loading: true
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        ...action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error || 'error loading data'
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.unbundling && globalState.unbundling.loaded;
}
/**
 * performs an http request for unbundling data
 * @param  {obj} unbundling api post request args
 * @return {object}
 */
export function load(data = {
  match: {'year': 2013},
  group: {'_id': '$id-to', 'total': {'$sum': '$value'}}
}) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.post('unbundling', {data})
  };
}
