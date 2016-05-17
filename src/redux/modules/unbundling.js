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
const SELECT_OPTIONS = 'unbundling/SELECT_OPTIONS';
const SELECT_OPTIONS_COMPARISON = 'unbundling/SELECT_OPTIONS_COMPARISON';
const CHANGE_TREE_MAP_DEPTH = 'unbundling/CHANGE_TREE_MAP_DEPTH';
const CHANGE_TREE_MAP_DEPTH_COMPARISON = 'unbundling/CHANGE_TREE_MAP_DEPTH_COMPARISON';
const CHANGE_COMPARE_BUTTON_LABLE = 'unbundling/CHANGE_COMPARE_BUTTON_LABLE';
const HYDRATE = 'unbundling/HYDRATE';
// const PERSIST = 'unbundling/PERSIST';
import {getFromSessionStorage, storeInSessionStorage} from '../cache';

const initialState = {
  loaded: false,
  loading: true,
  optionLoaded: false,
  optionLoading: true,
  comparisonLoading: false,
  cacheKeys: [],
  comparisonLoaded: false,
  apiRequestComparison: {},
  chartCount: 1,
  treeMapDepthMain: 0,
  compareBtnLable: 'Compare',
  selectOptionsComparison: {},
  selectOptions: {
    year: {value: 2013},
    sector: { niceName: 'All', value: 'All'},
    bundle: { niceName: 'All', value: 'All'},
    'id-to': { niceName: 'All', value: 'All'},
    'id-from': { niceName: 'All', value: 'All'},
    channel: { niceName: 'All', value: 'All'}
  }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_COMPARE_BUTTON_LABLE: {
      return {
        ...state,
        compareBtnLable: action.compareBtnLable
      };
    }
    case SELECT_OPTIONS: {
      return {
        ...state,
        selectOptions: Object.assign({}, state.selectOptions, action.selectOptions)
      };
    }
    case SELECT_OPTIONS_COMPARISON: {
      return {
        ...state,
        selectOptionsComparison: Object.assign({}, state.selectOptionsComparison, action.selectOptionsComparison)
      };
    }
    case CHANGE_TREE_MAP_DEPTH: {
      return {
        ...state,
        treeMapDepthMain: action.treeMapDepthMain
      };
    }
    case CHANGE_TREE_MAP_DEPTH_COMPARISON: {
      return {
        ...state,
        treeMapDepthComparison: action.treeMapDepthComparison
      };
    }
    case CHANGE_CHART_COUNT: {
      return {
        ...state,
        treeMapDepthComparison: state.treeMapDepthMain,
        chartCount: action.chartCount,
        selectOptionsComparison: state.selectOptions,
        apiRequestComparison: state.apiRequestMain,
        comparisonData: state.data
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
      storeInSessionStorage(action, state);
      return {
        ...state,
        loading: false,
        loaded: true,
        cacheKeys: [...state.cacheKeys, action.cacheKey],
        data: action.result,
        apiRequestMain: action.apiRequest
      };
    case LOAD_COMPARISON_SUCCESS:
      // storeInSessionStorage(action, state); // cache current state
      return {
        ...state,
        chartCount: 2,
        comparisonLoading: false,
        comparisonLoaded: true,
        comparisonData: action.result,
        cacheKeys: [...state.cacheKeys, action.cacheKey],
        apiRequestComparison: action.apiRequest
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
    case HYDRATE: {
      const store = getFromSessionStorage(action.hydrateKey);
      return {
        ...store
      };
    }
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
export function load(
  apiRequest = {
    match: {'year': 2013},
    group: {_id: '$id-to', total: {'$sum': '$value'}}
  },
  types = [LOAD, LOAD_SUCCESS, LOAD_FAIL] ) {
  const date = new Date();
  return {
    types,
    promise: (client) => client.post('unbundling', {data: apiRequest}),
    apiRequest,
    cacheKey: date.toISOString()
  };
}

export function loadOptions() {
  return {
    types: [OPTION, OPTION_SUCCESS, OPTION_FAIL],
    promise: (client) => client.post('unbundling/options')
  };
}

export function loadComparisonData(apiRequest) {
  return load(apiRequest, [LOAD_COMPARISON, LOAD_COMPARISON_SUCCESS, LOAD_COMPARISON_FAIL]);
}

export function changeChartCount(count) {
  return {
    type: CHANGE_CHART_COUNT,
    chartCount: count
  };
}
/**
 * pdateSelectOptions takes a portion of the selectOptions object or all of it and
 * replaces the current states selectOptions object with the new one.
 * @param  {object} selectOptions
 * @return {object}
 */
export function updateSelectOptions(selectOptions ) {
  return {
    type: SELECT_OPTIONS,
    selectOptions: selectOptions
  };
}

export function updateComparisonSelectOptions(selectOptions) {
  return {
    type: SELECT_OPTIONS_COMPARISON,
    selectOptionsComparison: selectOptions
  };
}

export function changeTreeMapDepth(treeMapDepthMain) {
  return {
    type: CHANGE_TREE_MAP_DEPTH,
    treeMapDepthMain,
  };
}

export function changeTreeMapDepthComparison(treeMapDepthComparison) {
  return {
    type: CHANGE_TREE_MAP_DEPTH_COMPARISON,
    treeMapDepthComparison,
  };
}

export function changeCompareBtnLable(compareBtnLable) {
  return {
    type: CHANGE_COMPARE_BUTTON_LABLE,
    compareBtnLable
  };
}

// export function cacheStore(cacheKey) {
//   return {
//     type: PERSIST,
//     cacheKey
//   };
// }

export function hydrateStore(cacheKey) {
  return {
    type: HYDRATE,
    hydrateKey: cacheKey
  };
}
