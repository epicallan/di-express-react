import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {isLoaded, load} from 'redux/modules/unbundling';
import { asyncConnect } from 'redux-async-connect';
// import {connect} from 'react-redux';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(load());
    }
  }
}])
export default class Uganda extends Component {
  render() {
    return (
      <div>
        <Helmet title="unbundling Aid"/>
        <h3> unbundling Aid</h3>
        <p> Content goes here</p>
      </div>
    );
  }
}
