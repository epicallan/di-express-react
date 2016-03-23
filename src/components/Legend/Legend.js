import React, { Component, PropTypes} from 'react';
import d3 from 'd3';

export default class Legend extends Component {
  static propTypes = {
    indicator: PropTypes.string,
    defaultFill: PropTypes.string,
    domain: PropTypes.array,
    range: PropTypes.array,
  }

  componentDidMount() {
    const {range, domain} = this.props;
    this.draw(range, domain);
  }

  componentWillUpdate(nextProps) {
    const {range, domain} = nextProps;
    this.draw(range, domain);
  }

  draw(range, domain) {
    const scale = this.createScale(range, domain);
    const legendElement = d3.select('#legend');
    this.creatColorLegend(scale, legendElement);
  }

  createScale(range, domain) {
    return d3.scale.threshold()
          .domain(domain)
          .range(range);
  }

  creatColorLegend(scale, legend) {
    const {indicator, defaultFill} = this.props;
    // remove any existing legend color bars if any exists
    legend.selectAll('li').remove();
    const keys = legend.selectAll('li').data(scale.range());
    keys.enter().append('li')
    .style('background-color', (value) => value)
    .style('color', (value) => {
      const col = d3.hsl(value);
      if (col.l > 0.7) {
        return 'black';
      }
      return 'white';
    })
    .text((value, index) => {
      const extents = scale.invertExtent(value);
      if (index === 0) return '< ' + extents[1];

      if (index === scale.range().length - 1) return '> ' + extents[0];

      return extents[0] + '-' + extents[1];
    });
    if (indicator !== 'largest-intl-flow') {
      legend.append('li')
      .style('background-color', defaultFill)
      .text(() => 'no data / not applicable');
    }
  }

  render() {
    const styles = require('./Legend.scss');
    return (
      <section refs = "legend" id = "legend" className = {styles.legend}></section>
    );
  }
}
