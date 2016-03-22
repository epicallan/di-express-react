import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import profile from './profile';
import spotlight from './spotlight';

// TODO we have 2 reducer variables and one not being used line  4 and line 8
export default combineReducers({
  routing: routeReducer,
  reduxAsyncConnect,
  spotlight,
  profile
});
