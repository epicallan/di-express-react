import d3 from 'd3-geo-projection';
import React, {Component, PropTypes} from 'react';
import Datamaps from 'datamaps';
import 'topojson';
import {connect} from 'react-redux';

@connect(
  state => ({
    id: state.profile.id,
    name: state.profile.name,
  })
)
export default class Spotlight extends Component {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.string
  }
  // draw map when component loads
  componentDidMount() {
    if (__CLIENT__) this.draw();
  }
  // component variables
  map = null;
  // datamap options
  mapOptions = {
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
    this.map = new Datamaps({
      element: this.refs.maps,
      ...this.mapOptions,
      width: this.refs.maps.offsetWidth
    });
  };

  render() {
    const styles = require('./District.scss');
    return (
      <div>
        <h1>District Profile {this.props.name} </h1>
        <section id="maps" ref="maps" className={styles.maps} ></section>
      </div>
    );
  }
}
