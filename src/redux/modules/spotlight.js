const LOAD = 'spotlight/LOAD';
const LOAD_SUCCESS = 'spotlight/LOAD_SUCCESS';
const LOAD_FAIL = 'spotlight/LOAD_FAIL';
const BASE = 'spotlight/BASE';
const BASE_SUCCESS = 'spotlight/BASE_SUCCESS';
const BASE_FAIL = 'spotlight/BASE_FAIL';
// import {cacheSpotlightData} from '../cache';

const initialState = {
  loaded: false,
  loading: true,
  baseLoaded: false,
  baseLoading: true,
  defaultFill: '#bbb'
};
/**
 * [convertIntoMapDataObject converts data from api into mapData for dataMap
 * this function is here instead of having it in the components to avoid having to recall it
 * when we need data for a specific year]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function convertIntoMapDataObject(data) {
  const mapData = {};
  Object.keys(data).forEach(year => {
    const mapYearData = {};
    data[year].forEach(row => {
      Object.assign(mapYearData, {[row.id]: row.color}); // copying object into mapYearData object
    });
    mapData[year] = mapYearData;
  });
  return mapData;
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case BASE:
      return {
        ...state,
        baseLoading: true
      };
    case LOAD_SUCCESS:
      // storeInSessionStorage(action, state);
      // cacheSpotlightData(action); // TODO re-enable later
      return {
        ...state,
        loading: false,
        loaded: true,
        indicator: action.indicator,
        currentTheme: action.currentTheme,
        ...action.result,
        currentYear: action.result.years[0],
        mapData: convertIntoMapDataObject(action.result.data),
        error: null
      };
    case BASE_SUCCESS:
      return {
        ...state,
        ...action.result,
        currentTheme: Object.keys(action.result.themes)[0], // TODO I am making an assumption that themes array will always be arranged this way.
        baseLoading: false,
        baseLoaded: true
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    case BASE_FAIL:
      return {
        ...state,
        baseLoaded: false,
        baseLoading: false
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.spotlight && globalState.spotlight.loaded;
}
export function isBaseLoaded(globalState) {
  return globalState.spotlight && globalState.spotlight.baseLoaded;
}
/**
 * performs an http request for spotlight data
 * @param  {string} indicator api-url part
 * @return {object}
 */
export function load(indicator = '/spotlight/uganda-poverty-headcount', currentTheme = 'uganda-poverty') {
  const indicatorName = indicator.split('/')[2];
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    indicator: indicatorName,
    apiRequest: indicator,
    currentTheme,
    promise: (client) => client.get(indicator)
  };
}
/**
 * loadBaseData : loads data that is used by all spotlight indicators
 * such as the district entities and themes
 */
export function loadBaseData() {
  return {
    types: [BASE, BASE_SUCCESS, BASE_FAIL],
    promise: (client) => client.get('/spotlight/base')
  };
}
