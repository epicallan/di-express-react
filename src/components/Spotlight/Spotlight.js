import d3 from 'd3-geo-projection';
import React, {Component, PropTypes} from 'react';
import Datamaps from 'datamaps';
import 'topojson';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import {load} from 'redux/modules/spotlight';
import Legend from '../Legend/Legend';
import Themes from '../Themes/Themes';
import {update} from 'redux/modules/profile';
import cx from 'classnames';

@connect(
  state => ({
    mapData: state.spotlight.mapData,
    data: state.spotlight.data,
    heading: state.spotlight.meta['laymans-heading'],
    description: state.spotlight.meta['laymans-decription'],
    entities: state.spotlight.entities,
    dispatch: state.dispatch,
    domain: state.spotlight.domain,
    range: state.spotlight.range,
    indicator: state.spotlight.indicator,
    defaultFill: state.spotlight.defaultFill,
    themes: state.spotlight.themes
  })
)
export default class Spotlight extends Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    mapData: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    entities: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    indicator: PropTypes.string,
    defaultFill: PropTypes.string,
    domain: PropTypes.array,
    themes: PropTypes.array.isRequired,
    range: PropTypes.array,
  };
  constructor() {
    super();
    this.map = null;
    this.mouseDownPosition = null;
    this.mouseUpPosition = null;
    // datamap options
    this.mapOptions = {
      height: 900,
      responsive: true,
      projection: 'eckert3',
      setProjection: (element) => {
        const projection = d3.geo.eckert3()
               .center([33, 1])
               .scale(element.offsetWidth * 3)
               .translate([element.offsetWidth / 2, element.offsetHeight / 3]);
        const path = d3.geo.path().projection(projection);
        return {path, projection};
      },
      fills: {
        defaultFill: '#bbb'
      },
      geographyConfig: {
        popupOnHover: false,
        highlightOnHover: false,
        borderWidth: 1,
        borderColor: '#eee',
        dataUrl: '/uganda.json'
      },
      done: (datamap) => {
        datamap.updateChoropleth(this.props.mapData);
        this.mapMouseHandlers(datamap);
      }
    };
  }
  // draw map when component loads
  componentDidMount() {
    this.draw();
  }

  componentWillUpdate(nextProps) {
    // updates map with new data from the spotlight store
    this.map.updateChoropleth(nextProps.mapData);
  }

  getTipTemplate(node) {
    const data = this.props.data.find(obj => obj.id === node.id);
    const entity = this.props.entities.find(obj => obj.id === node.id);
    let template = '<span class="name">' + entity.name + '</span>';
    if (data) {
      template += '<em>' + this.props.indicator + ': ' + ' <b class="value">' + data.value + '</b>' +
                    ' in ' + data.year + '</em>';
    } else {
      template += '<em>No data</em>';
    }
    return template;
  }

  getTipPosition(svgSize, tooltipSize) {
    const pos = d3.mouse(this.map.svg.node()).map(value => parseInt(value, 10));
    pos[0] -= tooltipSize.width / 2;
    pos[1] -= tooltipSize.height + 10;
    // Prevent top collision
    if (pos[1] < 25) pos[1] += tooltipSize.height * 1.5;
    // Prevent left collision
    if (pos[0] < 5) pos[0] = 5;
    // Prevent right collision
    if ((pos[0] + tooltipSize.width) > (svgSize.width - 5)) pos[0] = svgSize.width - tooltipSize.width - 5;
    return pos;
  }

  mapMouseHandlers = (datamap) => {
    /* eslint-disable func-names*/
    const tooltip = d3.select('#tooltip');
    const self = this;
    let svgSize = null;
    let tooltipSize = null;
    datamap.svg.selectAll('.datamaps-subunit')
    .on('mousedown', () => {
      this.mouseDownPosition = d3.mouse(datamap.svg.node());
    })
    .on('mouseup', (node) => {
      this.mouseUpPosition = d3.mouse(datamap.svg.node());
      // only do something if same area is clicked
      if (Math.abs(this.mouseDownPosition[0] - this.mouseUpPosition[0]) > 3 ||
          Math.abs(this.mouseDownPosition[1] - this.mouseUpPosition[1]) > 3) return;
      const selected = this.props.entities.find(obj => obj.id === node.id);
      // create region / country url
      if (!selected.slug) return;
      // dsitpatch update to profile store
      this.props.dispatch(update(selected));
      // go to district page
      browserHistory.push(`/district/${selected.slug}`);
    })
    .on('mousemove', () => {
      if (tooltip.classed('hidden')) return;
      if (!tooltipSize) console.log('the heck is tooltipSize');
      const pos = this.getTipPosition(svgSize, tooltipSize);
      tooltip.attr('style', 'left:' + pos[0] + 'px; top:' + pos[1] + 'px');
    })
    .on('mouseover', function(datum) {
      const node = d3.select(this);
      tooltip.classed('hidden', false).html(self.getTipTemplate(datum));
      svgSize = self.map.svg.node().getBoundingClientRect();
      tooltipSize = tooltip.node().getBoundingClientRect();
      node.style('fill', d3.hsl(node.style('fill')).darker(0.5));
    })
    .on('mouseout', function() {
      const node = d3.select(this);
      tooltip.classed('hidden', true);
      node.style('fill', d3.hsl(node.style('fill')).brighter(0.5));
    });
  }

  updateMapClickHandler = (indicator) =>{
    // dispatch action for new data on mouse event
    this.props.dispatch(load(`/spotlight/${indicator}`));
  }

  draw = () => {
    this.map = new Datamaps({
      element: this.refs.maps,
      ...this.mapOptions,
      width: this.refs.maps.offsetWidth
    });
  };

  render() {
    const styles = require('./Spotlight.scss');
    const { defaultFill, range, domain, indicator, description, heading, themes} = this.props;
    return (
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
        <section id="maps" ref="maps" className={styles.maps} ></section>
      </div>
    );
  }
}
