const LOAD = 'unbundling/LOAD';
const LOAD_SUCCESS = 'unbundling/LOAD_SUCCESS';
const LOAD_FAIL = 'unbundling/LOAD_FAIL';
const OPTION = 'unbundling/OPTION';
const OPTION_SUCCESS = 'unbundling/OPTION_SUCCESS';
const OPTION_FAIL = 'unbundling/OPTION_FAIL';

const initialState = {
  loaded: false,
  loading: true,
  optionLoaded: false,
  optionLoading: true,
  data: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case OPTION:
      return {
        ...state,
        optionLoading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case OPTION_SUCCESS:
      return {
        ...state,
        optionLoading: false,
        optionloaded: true,
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
    case OPTION_FAIL:
      return {
        ...state,
        optionLoading: false,
        optionloaded: false,
        error: action.error || 'error loading options data'
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.unbundling && globalState.unbundling.loaded;
}
export function isOptionsLoaded(globalState) {
  return globalState.unbundling && globalState.unbundling.optionLoaded;
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

export function loadOptions() {
  return {
    types: [OPTION, OPTION_SUCCESS, OPTION_FAIL],
    promise: (client) => client.post('unbundling/options')
  };
}
