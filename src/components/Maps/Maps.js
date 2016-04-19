import d3 from 'd3-geo-projection';
import React, {Component, PropTypes} from 'react';
import Datamaps from 'datamaps';
import 'topojson';


export default class Map extends Component {
  static propTypes = {
    options: PropTypes.obj,
    mapId: PropTypes.string
  }
  // draw map when component loads
  componentDidMount() {
    this.draw();
  }
  // component attributes
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
    const mapOptions = Object.assign({}, this.mapOptions, this.props.options);
    this.map = new Datamaps({
      element: this.refs.maps,
      ...mapOptions,
      width: this.refs.maps.offsetWidth
    });
  };

  centerMap(datamap, interpolateZoom) {
    const width = this.refs.maps.offsetWidth;
    const height = this.mapOptions.height;
    /* eslint-disable id-length*/
    const node = datamap.svg.select('path.' + this.props.mapId); // gets us curret region / district node
    node.style('fill', 'rgba(186,12,47,1)');

    if (!node) return;
    const nodeData = node.data()[0];

    const widthOffset = 1.25;
    const zoomFactor = 0.2;
    const bounds = datamap.path.bounds(nodeData);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = zoomFactor / Math.max(dx / width, dy / height);
    const translate = [width / widthOffset - scale * x, height / 2.4 - scale * y];
    interpolateZoom(translate, scale);
  }

  interpolateZoom = (translate, scale) => {
    const zoom = this.zoom;
    const zoomed = this.zoomed;
    return d3.transition().duration(350).tween('zoom', () => {
      const iTranslate = d3.interpolate(zoom.translate(), translate);
      const iScale = d3.interpolate(zoom.scale(), scale);
      return (t) => {
        zoom
        .scale(iScale(t))
        .translate(iTranslate(t));
        zoomed();
      };
    });
  }

  zoomed = () => {
    this.map.svg.selectAll('g')
    .attr('transform', 'translate(' + this.zoom.translate() + ')scale(' + this.zoom.scale() + ')');
    this.map.svg.selectAll('.datamaps-subunit')
    .style('stroke-width', (this.mapOptions.geographyConfig.borderWidth / this.zoom.scale()) + 'px');
  }

  render() {
    const styles = require('./Maps.scss');
    return (
      <section id="maps" ref="maps" className={styles.maps} />
    );
  }
}
