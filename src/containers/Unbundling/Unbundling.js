import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {isLoaded, load, isOptionsLoaded, loadOptions} from 'redux/modules/unbundling';
import { asyncConnect } from 'redux-async-connect';
import {TreeMap} from '../../components';
import {connect} from 'react-redux';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];
    if (!isLoaded(getState())) promises.push(dispatch(load())); // getting unbundling data

    if (!isOptionsLoaded(getState())) promises.push(dispatch(loadOptions())); // getting unbundling data options

    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    data: state.unbundling.data
  })
)
export default class Unbundling extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }
  render() {
    return (
      <div>
        <Helmet title="unbundling Aid"/>
        <h3> unbundling Aid</h3>
        <TreeMap data = {this.props.data} />
      </div>
    );
  }
}
