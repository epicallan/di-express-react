import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {isLoaded, isBaseLoaded, load, loadBaseData} from 'redux/modules/spotlight';
import {Spotlight} from 'components';
import { asyncConnect } from 'redux-async-connect';
// import {connect} from 'react-redux';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];
    if (!isLoaded(getState())) promises.push(dispatch(load()));

    if (!isBaseLoaded(getState())) promises.push(dispatch(loadBaseData()));

    return Promise.all(promises);
  }
}])
export default class Uganda extends Component {
  render() {
    return (
      <div>
        <Helmet title="Spotlight on Uganda"/>
        <Spotlight />
      </div>
    );
  }
}
