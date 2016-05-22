import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {load} from 'redux/modules/spotlight';
import Legend from '../Legend/Legend';
import ProgressBar from '../ProgressBar/ProgressBar';
import SpotlightThemesMenu from '../SpotlightThemesMenu/SpotlightThemesMenu';
import {bindActionCreators} from 'redux';
import {update} from 'redux/modules/profile';
import Maps from '../Maps/Maps';
import {mapMouseHandlers} from '../Maps/Utils/Mouse';
import cx from 'classnames';

// attaching store to Component
@connect(
  state => ({
    loaded: state.spotlight.loaded,
    mapData: state.spotlight.mapData,
    data: state.spotlight.data,
    currentYear: state.spotlight.currentYear,
    entities: state.spotlight.entities,
    domain: state.spotlight.domain,
    range: state.spotlight.range,
    indicator: state.spotlight.indicator,
    defaultFill: state.spotlight.defaultFill,
    themes: state.spotlight.themes,
    currentTheme: state.spotlight.currentTheme
  }),
  dispatch => ({ actions: bindActionCreators({update, load}, dispatch)})
)
export default class Spotlight extends Component {

  static propTypes = {
    mapData: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    entities: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    indicator: PropTypes.string,
    defaultFill: PropTypes.string,
    domain: PropTypes.array,
    currentTheme: PropTypes.string.isRequired,
    themes: PropTypes.object.isRequired,
    range: PropTypes.array.isRequired,
    loaded: PropTypes.bool.isRequired,
    currentYear: PropTypes.string.isRequired
  };

  mapOptions = {
    done: (datamap) => {
      // initial render
      const {actions, entities, data, indicator, mapData, currentYear} = this.props;
      datamap.updateChoropleth(mapData[currentYear]);
      mapMouseHandlers(datamap, {
        update: actions.update,
        entities,
        data: data[currentYear],
        indicator
      });
    }
  };

  render() {
    const styles = require('./Spotlight.scss');
    const {
      defaultFill,
      range,
      domain,
      indicator,
      themes,
      currentTheme,
      mapData,
      currentYear,
      actions} = this.props;
    const {heading, description} = themes[currentTheme].main;
    return (
      <div>
        <ProgressBar />
        <div className= {styles.spotlight}>
          <section className= {styles.mapSupport}>
            <SpotlightThemesMenu
              indicator= {indicator}
              loadData={actions.load}
              currentTheme = {currentTheme}
              themes = {themes} />
            <article className = {styles.description}>
              <h3>{heading}</h3>
              <p>{description}</p>
            </article>
            <Legend
              defaultFill = {defaultFill}
              range = {range}
              domain = {domain}
              indicator= {indicator} />
            <div id="tooltip" className={cx(styles.tooltip, 'hidden')}></div>
          </section>
          <Maps options = {this.mapOptions} mapData = {mapData} currentYear = {currentYear} />
        </div>
      </div>
    );
  }
}
