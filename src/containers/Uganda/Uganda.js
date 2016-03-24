import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {isLoaded, load} from 'redux/modules/spotlight';
import {Spotlight} from 'components';
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
    themes: state.spotlight.themes,
    meta: state.spotlight.meta,
  })
)
export default class Uganda extends Component {
  static propTypes = {
    themes: PropTypes.array,
    meta: PropTypes.object,
    loading: PropTypes.bool,
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
