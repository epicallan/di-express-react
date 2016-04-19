const LOAD = 'unbundling/LOAD';
const LOAD_SUCCESS = 'unbundling/LOAD_SUCCESS';
const LOAD_FAIL = 'unbundling/LOAD_FAIL';

const initialState = {
  loaded: false,
  loading: true
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
    case LOAD_SUCCESS:
      // console.log('actions');
      // console.log(action);
      return {
        ...state,
        loading: false,
        loaded: true,
        indicator: action.indicator,
        domain: action.result.domain,
        range: action.result.range,
        themes: action.result.themes,
        data: action.result.data,
        mapData: getMapData(action.result.data),
        entities: action.result.entities,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
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
 * @param  {string} indicator api-url part
 * @return {object}
 */
export function load(indicator = '/unbundling/uganda-poverty-headcount') {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    indicator: indicator.split('/')[2],
    promise: (client) => client.get(indicator)
  };
}
