import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {isLoaded, load, isOptionsLoaded, loadOptions} from 'redux/modules/unbundling';
import { asyncConnect } from 'redux-async-connect';
// import {connect} from 'react-redux';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isLoaded(getState())) promises.push(dispatch(load())); // getting unbundling data

    if (!isOptionsLoaded(getState())) promises.push(dispatch(loadOptions())); // getting unbundling data options

    return Promise.all(promises);
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
