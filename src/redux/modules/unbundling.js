const LOAD = 'unbundling/LOAD';
const LOAD_SUCCESS = 'unbundling/LOAD_SUCCESS';
const LOAD_FAIL = 'unbundling/LOAD_FAIL';
const LOAD_COMPARISON = 'unbundling/LOAD_COMPARISON';
const COMPARISON_STOP = 'unbundling/COMPARISON_STOP';
const LOAD_COMPARISON_SUCCESS = 'unbundling/LOAD_COMPARISON_SUCCESS';
const LOAD_COMPARISON_FAIL = 'unbundling/LOAD_COMPARISON_FAIL';
const OPTION = 'unbundling/OPTION';
const OPTION_SUCCESS = 'unbundling/OPTION_SUCCESS';
const OPTION_FAIL = 'unbundling/OPTION_FAIL';
const CHANGE_CHART_COUNT = 'unbundling/CHANGE_CHART_COUNT';

const initialState = {
  loaded: false,
  loading: true,
  optionLoaded: false,
  optionLoading: true,
  comparisonLoading: false,
  comparisonLoaded: false,
  chartCount: 1
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_CHART_COUNT: {
      return {
        ...state,
        comparisonData: state.data,
        chartCount: action.chartCount
      };
    }
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_COMPARISON:
      return {
        ...state,
        comparisonLoading: true
      };
    case OPTION:
      return {
        ...state,
        optionLoading: true
      };
    case LOAD_SUCCESS:
      // console.log('unbundling load: ', action.result);
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case LOAD_COMPARISON_SUCCESS:
      return {
        ...state,
        chartCount: 2,
        comparisonLoading: false,
        comparisonLoaded: true,
        comparisonData: action.result
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
    case LOAD_COMPARISON_FAIL:
      return {
        ...state,
        chartCount: 1,
        comparisonLoaded: false,
        comparisonLoading: false,
        comparisonData: null,
        error: action.error || 'error loading data'
      };
    case OPTION_FAIL:
      return {
        ...state,
        optionLoading: false,
        optionloaded: false,
        error: action.error || 'error loading options data'
      };
    case COMPARISON_STOP:
      return {
        ...state,
        chartCount: 1,
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
}, types = [LOAD, LOAD_SUCCESS, LOAD_FAIL] ) {
  return {
    types,
    promise: (client) => client.post('unbundling', {data})
  };
}

export function loadOptions() {
  return {
    types: [OPTION, OPTION_SUCCESS, OPTION_FAIL],
    promise: (client) => client.post('unbundling/options')
  };
}

export function loadComparisonData(args) {
  return load(args, [LOAD_COMPARISON, LOAD_COMPARISON_SUCCESS, LOAD_COMPARISON_FAIL]);
}

export function changeChartCount(count) {
  return {
    type: CHANGE_CHART_COUNT,
    chartCount: count
  };
}
