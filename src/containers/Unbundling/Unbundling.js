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
    data: PropTypes.object.isRequired,
    comparisonData: PropTypes.object,
    chartCount: PropTypes.number
  }

  OnStopComparison = ()=>{
    // hide comparisonContainer element from dom
    this.refs.comparisonContainer.setAttribute('style', 'display: none');
  }

  render() {
    const chartClass = this.props.chartCount === 2 ? 'col-md-6' : 'col-md-12';
    return (
      <div>
        <Helmet title="unbundling Aid"/>
        <h3> unbundling Aid </h3>
        <section className= "row">
          <div className = {chartClass} >
            <TreeMap data = {this.props.data} />
          </div>
          {(() => {
            // on comparison we need another chart
            if (this.props.chartCount === 2) {
              return (
                <div className= "col-md-6" ref="comparisonContainer">
                  <TreeMap data = {this.props.comparisonData} />
                </div>
              );
            }
          })()}
        </section>
      </div>
    );
  }
}
