import d3 from 'd3-geo-projection';
import React, {Component, PropTypes} from 'react';
import Maps from '../Maps/Maps';
import {zoomed, centerMap} from '../Maps/Utils/Positioning';
import {connect} from 'react-redux';
import cx from 'classnames';

@connect(
  state => ({
    profileId: state.profile.id,
    name: state.profile.name,
    slug: state.profile.slug
  })
)
export default class Spotlight extends Component {
  static propTypes = {
    name: PropTypes.string,
    profileId: PropTypes.string
  }
  // datamap options
  mapOptions = {
    height: 500,
    geographyConfig: {
      popupOnHover: false,
      highlightOnHover: false,
      borderWidth: 1,
      borderColor: '#eee',
      dataUrl: '/uganda.json'
    },
    setProjection: (element) => {
      const projection = d3.geo.eckert3()
             .center([33, 1])
             .scale(element.offsetWidth * 2)
             .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
      const path = d3.geo.path().projection(projection);
      return {path, projection};
    },
    done: (datamap) => {
      const zoom = d3.behavior.zoom().on('zoom', zoomed);
      datamap.svg.call(zoom);
      const mapElm = document.getElementById('maps');
      centerMap(datamap, this.mapOptions, mapElm, zoom, this.props.profileId);
    }
  }

  render() {
    const styles = require('./District.scss');
    return (
      <div className= "container-fluid">
        <div className ={cx('row', styles.head)}>
          <div className={cx('col-md-7', styles.content)}>
            <h1>{this.props.name}</h1>
            <article>
              <p>
                Explore this in-depth profile to find out about poverty,
                population, education, health, water,
                sanitation and hygiene, and district public resources in Mukono
              </p>
            </article>
          </div>
          <div className="col-md-5">
            <Maps options = {this.mapOptions} />
          </div>
        </div>
      </div>
    );
  }
}
