const LOAD = 'profile/LOAD';
const UPDATE = 'profile/UPDATE';
const LOAD_SUCCESS = 'profile/LOAD_SUCCESS';
const LOAD_FAIL = 'profile/LOAD_FAIL';
// const CHANGE_SUCCESS = 'profile/CHANGE_SUCCESS';
// const CHANGE_FAIL = 'profile/CHANGE_FAIL';
// const CHANGE = 'profile/CHANGE';

const initialState = {
  loaded: false,
  loading: true,
  slug: null,
  name: null,
  id: null,
  error: null
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
        name: action.name,
        id: action.result.id,
        error: null
      };
    case UPDATE:
      return Object.assign({}, state, {
        name: action.name,
        id: action.id,
        error: null
      });
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.profile.id && globalState.profile.loaded;
}

export function load(slug) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    name: slug,
    promise: (client) => client.get(`/profile/${slug}`)
  };
}
export function update(name, slug, id) {
  return {
    type: UPDATE,
    slug,
    name,
    id
  };
}
