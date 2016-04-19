import React, {Component, PropTypes} from 'react';
import Datamaps from 'datamaps';
import 'topojson';
import {connect} from 'react-redux';
import {load} from 'redux/modules/spotlight';
import Legend from '../Legend/Legend';
import ProgressBar from '../ProgressBar/ProgressBar';
import Themes from '../Themes/Themes';
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
    entities: state.spotlight.entities,
    update: bindActionCreators(update, state.dispatch),
    load: bindActionCreators(load, state.dispatch),
    domain: state.spotlight.domain,
    range: state.spotlight.range,
    indicator: state.spotlight.indicator,
    defaultFill: state.spotlight.defaultFill,
    themes: state.spotlight.themes
  })
)
export default class Spotlight extends Component {

  static propTypes = {
    mapData: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    entities: PropTypes.array.isRequired,
    load: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    indicator: PropTypes.string,
    defaultFill: PropTypes.string,
    domain: PropTypes.array,
    themes: PropTypes.array.isRequired,
    range: PropTypes.array.isRequired,
    loaded: PropTypes.bool.isRequired
  };

  constructor() {
    super();
    // datamap options
    this.mapOptions = {
      done: (datamap) => {
        datamap.updateChoropleth(this.props.mapData);
        mapMouseHandlers(datamap, {
          update,
          entities: this.props.entities,
          data: this.props.data
        });
      }
    };
  }

  componentWillUpdate(nextProps) {
    // updates map with new data from the spotlight store
    this.map.updateChoropleth(nextProps.mapData);
  }

  updateMapClickHandler = (indicator) =>{
    // dispatch action for new data on mouse event
    this.props.load(`/spotlight/${indicator}`);
  }

  draw = () => {
    this.map = new Datamaps({
      element: this.refs.maps,
      ...this.mapOptions,
      width: this.refs.maps.offsetWidth
    });
  };

  indicatorData = () => this.props.themes.find(theme => theme.slug === this.props.indicator);

  render() {
    const styles = require('./Spotlight.scss');
    const {heading, description} = this.indicatorData();
    const { defaultFill, range, domain, indicator, themes} = this.props;
    return (
      <div>
        <ProgressBar />
        <div className= {styles.spotlight}>
          <section className= {styles.mapSupport}>
            <Themes
              indicator= {indicator}
              clickHandler={this.updateMapClickHandler}
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
          <Maps options = {this.mapOptions} mapData = {this.props.mapData}/>
        </div>
      </div>
    );
  }
}
