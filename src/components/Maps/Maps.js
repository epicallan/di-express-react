import d3 from 'd3-geo-projection';
import React, {Component, PropTypes} from 'react';
import Datamaps from 'datamaps';
// import {throwError} from '../../utils/errorHandling';
import 'topojson';
import {mapMouseHandlers} from '../Maps/Utils/Mouse';
import styles from './Maps.scss';


export default class Map extends Component {
  static propTypes = {
    mapData: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    currentYear: PropTypes.string.isRequired,
    entities: PropTypes.array.isRequired,
    indicatorName: PropTypes.string.isRequired,
    updateToDistrictProfile: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.map = null;
  }
  // draw map when component loads
  componentDidMount() {
    this.draw(); // the very first map render happens in the done function.
  }

  componentWillUpdate(nextProps) {
    // this.mapDoneCallback(this.map);
    // updates map with new data from the spotlight store
    this.map.updateChoropleth(nextProps.mapData[nextProps.currentYear]);
    this.mouseMapEvents(this.map, nextProps);
    // console.log(this.map.options);
  }

  mouseMapEvents = (datamap, props) => {
    const {updateToDistrictProfile, entities, data, indicatorName, currentYear} = props;
    mapMouseHandlers(datamap, {
      update: updateToDistrictProfile,
      entities,
      data: data[currentYear],
      indicatorName
    });
  }


  // datamap options
  options = {
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
    }
  }

  draw = () => {
    const {mapData, currentYear} = this.props;
    this.map = new Datamaps({
      element: this.refs.maps,
      ...this.options,
      done: (datamap) => {
        // console.log('in done function');
        // called on initial run
        datamap.updateChoropleth(mapData[currentYear]);
        this.mouseMapEvents(datamap, this.props);
      },
      width: this.refs.maps.offsetWidth,
      height: 400
    });
  };

  render() {
    return (
      <section id="maps" ref="maps" className={styles.maps} />
    );
  }
}
