const LOAD = 'maps/LOAD';
const LOAD_SUCCESS = 'maps/LOAD_SUCCESS';
const LOAD_FAIL = 'maps/LOAD_FAIL';
// const CHANGE_SUCCESS = 'maps/CHANGE_SUCCESS';
// const CHANGE_FAIL = 'maps/CHANGE_FAIL';
// const CHANGE = 'maps/CHANGE';

const initialState = {
  loaded: false,
  loading: true,
  entities: null,
  mapData: null,
  error: null,
  themes: null,
  meta: null
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
        meta: action.result.meta,
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

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/spotlight/uganda-poverty-headcount')
  };
}
