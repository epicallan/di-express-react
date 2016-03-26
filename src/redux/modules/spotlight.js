const LOAD = 'spotlight/LOAD';
const LOAD_SUCCESS = 'spotlight/LOAD_SUCCESS';
const LOAD_FAIL = 'spotlight/LOAD_FAIL';

const initialState = {
  loaded: false,
  loading: true,
  entities: null,
  mapData: null,
  indicator: null,
  defaultFill: '#bbb',
  domain: null,
  range: null,
  error: null,
  themes: null
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
  return globalState.spotlight && globalState.spotlight.loaded;
}

export function load(indicator = '/spotlight/uganda-poverty-headcount') {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    indicator: indicator.split('/')[2],
    promise: (client) => client.get(indicator)
  };
}
