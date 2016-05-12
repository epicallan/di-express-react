import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {isLoaded, load, isOptionsLoaded, loadOptions, changeChartCount} from 'redux/modules/unbundling';
import { asyncConnect } from 'redux-async-connect';
import {TreeMap, UnbundlingMenu} from '../../components';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import cx from 'classnames';

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
    chartCount: state.unbundling.chartCount
  }),
  dispatch => ({ changeChartCount: bindActionCreators(changeChartCount, dispatch)})
)
export default class Unbundling extends Component {
  static propTypes = {
    chartCount: PropTypes.number.isRequired,
    changeChartCount: PropTypes.func.isRequired
  }
  state = {
    compareBtnLable: 'Compare'
  }
  /**
   * changes chartCount value to 2
   * @return {[type]} [description]
   */
  compareClickHandler = () => {
    if (this.state.compareBtnLable === 'Compare') {
      this.state.compareBtnLable = 'X';
      this.props.changeChartCount(2);
    } else {
      this.state.compareBtnLable = 'Compare';
      this.props.changeChartCount(1);
    }
  }
  render() {
    // console.log(this.props.chartCount);
    const chartClass = this.props.chartCount === 2 ? 'col-md-6' : 'col-md-12';
    const styles = require('./Unbundling.scss');
    return (
      <div>
        <Helmet title="unbundling Aid"/>
        <section className="container-fluid oda-story">
          <header className= {cx('row', styles.header)}>
            <h1 className="text-center"> Unbundling aid </h1>
            <div className = {chartClass}>
              <UnbundlingMenu />
            </div>
            {(() => {
              // on comparison we need another chart
              if (this.props.chartCount === 2) {
                return (
                  <div className= "col-md-6" ref="comparisonMenu">
                    <UnbundlingMenu />
                  </div>
                );
              }
            })()}
            <div className = {styles.comparisonBtn}>
              <button className="btn btn--on-light btn--square" onClick= {this.compareClickHandler.bind(this)}>
                  <span>{this.state.compareBtnLable}</span>
              </button>
            </div>
          </header>
          <section className= {cx('row')}>
            <div className = {chartClass} >
              <TreeMap treeMapRefName= "treemap1" />
            </div>
            {(() => {
              // on comparison we need another chart
              if (this.props.chartCount === 2) {
                return (
                  <div className= "col-md-6" ref="comparisonTreemap">
                    <TreeMap treeMapRefName= "treemap2" />
                  </div>
                );
              }
            })()}
          </section>
        </section>
      </div>
    );
  }
}
