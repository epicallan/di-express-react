import d3 from 'd3-geo-projection';
import React, {Component, PropTypes} from 'react';
import Datamaps from 'datamaps';
import {throwError} from '../../utils/errorHandling';
import 'topojson';


export default class Map extends Component {
  static propTypes = {
    options: PropTypes.object
  }
  // draw map when component loads
  componentDidMount() {
    this.draw();
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.mapData) throwError('component doesnt have new data for update');
    // updates map with new data from the spotlight store
    this.map.updateChoropleth(nextProps.mapData);
  }
  map = null;
  // datamap options
  options = {
    height: 900,
    responsive: true,
    projection: 'eckert3',
    setProjection: (element) => {
      const projection = d3.geo.eckert3()
             .center([33, 1])
             .scale(element.offsetWidth * 2)
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
    }
  }

  draw = () => {
    const mapOptions = Object.assign({}, this.options, this.props.options);
    this.map = new Datamaps({
      element: this.refs.maps,
      ...mapOptions,
      width: this.refs.maps.offsetWidth
    });
  };
  render() {
    const styles = require('./Maps.scss');
    return (
      <section id="maps" ref="maps" className={styles.maps} />
    );
  }
}
