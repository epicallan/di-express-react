import d3 from './d3';
import React, {Component} from 'react';
import Datamaps from 'datamaps';
import 'topojson';


export default class Maps extends Component {

  state = {
    map: null,
    mapOptions: {
      height: 300,
      scope: 'custom',
      width: 500,
      responsive: true,
      projection: 'eckert3',
      setProjection: (element) => {
        const projection = d3.geo.eckert3()
               .center([33, 1])
               .scale(element.offsetWidth)
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
  }

  componentDidMount() {
    this.draw();
  }

  draw = () => {
    const container = document.getElementById('maps');
    const map = new Datamaps({element: container, ...this.state});
    this.setState({map});
  };

  render() {
    return (
      <div>
        <p>
          Hello maps
        </p>
        <section id="maps" ref="maps"></section>
      </div>
    );
  }
}
