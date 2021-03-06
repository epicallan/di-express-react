import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {load, updateCurrentYear} from 'redux/modules/spotlight';
import Legend from '../Legend/Legend';
import YearSlider from '../YearSlider/YearSlider';
import ProgressBar from '../ProgressBar/ProgressBar';
import SpotlightThemesMenu from '../SpotlightThemesMenu/SpotlightThemesMenu';
import {bindActionCreators} from 'redux';
import {update} from 'redux/modules/profile';
import Maps from '../Maps/Maps';
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
    years: state.spotlight.years,
    currentTheme: state.spotlight.currentTheme
  }),
  dispatch => ({ actions: bindActionCreators({update, load, updateCurrentYear}, dispatch)})
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
    currentYear: PropTypes.string.isRequired,
    years: PropTypes.array.isRequired
  };

  currentThemeObj = (currentTheme, themes, indicator) => {
    const themeObj = themes[currentTheme];
    // the current themeObj can be the main object or part of the themes indicators
    if (themeObj.main.slug === indicator) return themeObj.main;
    return themeObj.indicators.find(obj => obj.slug === indicator );
  }

  render() {
    const styles = require('./Spotlight.scss');
    const {
      loaded,
      defaultFill,
      range,
      domain,
      indicator,
      themes,
      entities,
      data,
      currentTheme,
      mapData,
      currentYear,
      years,
      actions} = this.props;
    const currentIndicator = this.currentThemeObj(currentTheme, themes, indicator);
    const {heading, description, name} = currentIndicator;
    return (
      <div>
        <ProgressBar loaded = {loaded} />
        <div className= {styles.spotlight}>
          <section className= {styles.mapSupport}>
            <SpotlightThemesMenu
              indicator= {indicator}
              loadData={actions.load}
              currentTheme = {currentTheme}
              indicatorName = {name}
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
          <Maps
            mapData = {mapData}
            currentYear = {currentYear}
            data = {data}
            entities={entities}
            indicatorName = {name}
            updateToDistrictProfile ={actions.update} />
          <div className ={cx('row', styles.slider)}>
          {
            (()=>{
              if (years.length > 1) {
                return (
                    <div className = "col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12">
                      <YearSlider
                        updateCurrentYear = {actions.updateCurrentYear}
                        currentYear = {currentYear}
                        years = {years}
                        />
                    </div>
                );
              }
            })()
          }
        </div>
        </div>
      </div>
    );
  }
}
