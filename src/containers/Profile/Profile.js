import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {isLoaded, load} from 'redux/modules/profile';
import {District} from 'components';
import { asyncConnect } from 'redux-async-connect';


@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      const location = getState().routing.location.pathname;
      const district = location.split('/')[2];
      return dispatch(load(district));
    }
  }
}])

export default class Uganda extends Component {
  render() {
    return (
      <div className="container">
        <Helmet title="Profile"/>
        <District />
      </div>
    );
  }
}
