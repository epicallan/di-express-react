import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {isLoaded, load} from 'redux/modules/unbundling';
import { asyncConnect } from 'redux-async-connect';
import {connect} from 'react-redux';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(load());
    }
  }
}])
@connect(
  state => ({
    them: state.spotlight.themes,
    loaded: state.spotlight.loaded,
    meta: state.spotlight.meta,
  })
)
export default class Uganda extends Component {
  static propTypes = {
    themes: PropTypes.array,
    meta: PropTypes.object,
    loaded: PropTypes.bool,
  };
  render() {
    return (
      <div>
        <Helmet title="Spotlight on Uganda"/>
        <Spotlight />
      </div>
    );
  }
}