import d3 from 'd3-geo-projection';
// import {bindActionCreators} from 'redux';
import React, {Component, PropTypes} from 'react';
import Datamaps from 'datamaps';
import 'topojson';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
// import * as spotlightActions from 'redux/modules/spotlight';
import {update} from 'redux/modules/profile';

@connect(
  state => ({
    mapData: state.spotlight.mapData,
    data: state.spotlight.data,
    entities: state.spotlight.entities,
    dispatch: state.dispatch,
  })
)
export default class Spotlight extends Component {
  static propTypes = {
    mapData: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    entities: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  };
  // draw map when component loads
  componentDidMount() {
    if (__CLIENT__) {
      this.draw();
      // this.mapMouseHandler();
    }
  }
  // component variables
  map = null;
  mouseDownPosition = null;
  mouseUpPosition = null;
  // datamap options
  mapOptions = {
    height: 900,
    responsive: true,
    projection: 'eckert3',
    setProjection: (element) => {
      const projection = d3.geo.eckert3()
             .center([33, 1])
             .scale(element.offsetWidth * 3.2)
             .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
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
      this.mapMouseHandler(datamap);
    }
  }

  draw = () => {
    this.map = new Datamaps({
      element: this.refs.maps,
      ...this.mapOptions,
      width: this.refs.maps.offsetWidth
    });
  };
  mapMouseHandler(datamap) {
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
      // console.log(selected);
      // dsitpatch update to profile store
      this.props.dispatch(update(selected));
      // console.log(district);
      browserHistory.push(`/district/${selected.slug}`);
    });
  }
  render() {
    const styles = require('./Spotlight.scss');
    return (
      <div>
        <section id="maps" ref="maps" className={styles.maps} ></section>
      </div>
    );
  }
}
