const LOAD = 'spotlight/LOAD';
const LOAD_SUCCESS = 'spotlight/LOAD_SUCCESS';
const LOAD_FAIL = 'spotlight/LOAD_FAIL';
const BASE = 'spotlight/BASE';
const BASE_SUCCESS = 'spotlight/BASE_SUCCESS';
const BASE_FAIL = 'spotlight/BASE_FAIL';
import {cacheSpotlightData} from '../cache';

const initialState = {
  loaded: false,
  loading: true,
  baseLoaded: false,
  baseLoading: true,
  defaultFill: '#bbb'
};

// exported for testing purposes
export function getMapData(data) {
  let mapData = {};
  data.forEach(row => {
    const obj = {};
    obj[row.id] = row.color;
    mapData = Object.assign({}, obj, mapData);
  });
  // console.log(data);
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
      cacheSpotlightData(action);
      return {
        ...state,
        loading: false,
        loaded: true,
        indicator: action.indicator,
        domain: action.result.domain,
        range: action.result.range,
        data: action.result.data,
        mapData: getMapData(action.result.data),
        error: null
      };
    case BASE_SUCCESS:
      return {
        ...state,
        ...action.result,
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
export function load(indicator = '/spotlight/uganda-poverty-headcount') {
  const indicatorName = indicator.split('/')[2];
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    indicator: indicatorName,
    apiRequest: indicator,
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
