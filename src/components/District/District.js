import d3 from 'd3-geo-projection';
import {bindActionCreators} from 'redux';
import React, {Component, PropTypes} from 'react';
import Datamaps from 'datamaps';
import 'topojson';
import {connect} from 'react-redux';
import styles from './District.scss';
import * as spotlightActions from 'redux/modules/spotlight';

@connect(
  state => ({
    mapData: state.spotlight.mapData
  }),
  dispatch => bindActionCreators(spotlightActions, dispatch)
)
export default class District extends Component {
  static propTypes = {
    mapData: PropTypes.object
  };
  state = {
    map: null,
    mapOptions: {
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
      }
    }
  }

  componentDidMount() {
    this.draw();
  }

  draw = () => {
    const container = document.getElementById('maps');
    const map = new Datamaps({
      element: container,
      ...this.state.mapOptions,
      width: this.refs.maps.offsetWidth,
      data: this.props.mapData
    });
    this.setState({map});
  };

  render() {
    return (
      <div>
        <section id="maps" ref="maps" className={styles.maps} ></section>
      </div>
    );
  }
}
