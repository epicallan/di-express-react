import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-async-connect';
import {TreeMap, UnbundlingMenu, CompareButton, BackButton} from '../../components';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import cx from 'classnames';
import {
  isLoaded,
  isOptionsLoaded,
  load,
  loadComparisonData,
  loadOptions,
  updateSelectOptions,
  updateComparisonSelectOptions,
  changeChartCount,
  changeTreeMapDepth,
  changeTreeMapDepthComparison,
  changeCompareBtnLable,
  hydrateStore,
  updateCacheKeys
} from 'redux/modules/unbundling';

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
    chartCount: state.unbundling.chartCount,
    data: state.unbundling.data,
    treeMapDepthMain: state.unbundling.treeMapDepthMain,
    treeMapDepthComparison: state.unbundling.treeMapDepthComparison,
    comparisonData: state.unbundling.comparisonData,
    apiRequestMain: state.unbundling.apiRequestMain,
    apiRequestComparison: state.unbundling.apiRequestComparison,
    selectOptions: state.unbundling.selectOptions,
    selectOptionsComparison: state.unbundling.selectOptionsComparison,
    compareBtnLable: state.unbundling.compareBtnLable,
    cacheKeys: state.unbundling.cacheKeys
  }),
  dispatch => ({ actions: bindActionCreators({
    load,
    loadComparisonData,
    loadOptions,
    updateSelectOptions,
    updateComparisonSelectOptions,
    changeChartCount,
    changeTreeMapDepth,
    changeCompareBtnLable,
    changeTreeMapDepthComparison,
    updateCacheKeys,
    hydrateStore
  }, dispatch)})
)
export default class Unbundling extends Component {
  static propTypes = {
    chartCount: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired,
    apiRequestMain: PropTypes.object.isRequired,
    apiRequestComparison: PropTypes.object,
    selectOptions: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    comparisonData: PropTypes.object,
    selectOptionsComparison: PropTypes.object,
    treeMapDepthMain: PropTypes.number.isRequired,
    treeMapDepthComparison: PropTypes.number,
    compareBtnLable: PropTypes.string.isRequired,
    cacheKeys: PropTypes.array.isRequired,
  }

  render() {
    const styles = require('./Unbundling.scss');
    const {
      actions,
      chartCount,
      apiRequestMain,
      apiRequestComparison,
      selectOptions,
      selectOptionsComparison,
      data,
      treeMapDepthMain,
      treeMapDepthComparison,
      compareBtnLable,
      comparisonData,
      cacheKeys
    } = this.props;
    const chartClass = chartCount === 2 ? 'col-md-6' : 'col-md-12';
    return (
      <div>
        <Helmet title="unbundling Aid"/>
        <section className="container-fluid oda-story">
          <header className= {cx('row', styles.header)}>
            <h1 className="text-center"> Unbundling aid </h1>
            <div className = {cx(chartClass, styles.menuContainer)}>
              <UnbundlingMenu
                menuType = {1}
                selectOptions = {selectOptions}
                apiRequest = {apiRequestMain}
                loadData = {actions.load}
                updateSelectOptions = {actions.updateSelectOptions}
                />
            </div>
            {(() => {
              // on comparison we need another chart
              if (this.props.chartCount === 2) {
                return (
                  <div className= {cx(chartClass, styles.menuContainer)} ref="comparisonMenu">
                    <UnbundlingMenu
                      menuType = {2}
                      selectOptions = {selectOptionsComparison}
                      apiRequest = {apiRequestComparison}
                      updateSelectOptions = {actions.updateComparisonSelectOptions}
                      loadData = {actions.loadComparisonData}
                      />
                  </div>
                );
              }
            })()}
            <CompareButton
              changeChartCount = {actions.changeChartCount}
              changeCompareBtnLable = {actions.changeCompareBtnLable}
              compareBtnLable = {compareBtnLable}
               />
             <BackButton
               cacheKeys = {cacheKeys}
               hydrateStore ={actions.hydrateStore}
               updateCacheKeys = {actions.updateCacheKeys}
               />
          </header>
          <section className= {cx('row')}>
            <div className = {chartClass} >
              <TreeMap
                treeMapType = {1}
                changeTreeMapDepth = {actions.changeTreeMapDepth}
                treeMapDepth = {treeMapDepthMain}
                data = {data}
                updateSelectOptions = {actions.updateSelectOptions}
                apiRequest = {apiRequestMain}
                loadData = {actions.load}
              />
            </div>
            {(() => {
              // on comparison we need another chart
              if (this.props.chartCount === 2) {
                return (
                  <div className= "col-md-6" ref="comparisonTreemap">
                    <TreeMap
                      treeMapType = {2}
                      treeMapDepth = {treeMapDepthComparison}
                      data = {comparisonData}
                      changeTreeMapDepth = {actions.changeTreeMapDepthComparison}
                      updateSelectOptions = {actions.updateComparisonSelectOptions}
                      apiRequest = {apiRequestComparison}
                      loadData = {actions.loadComparisonData}
                      />
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
