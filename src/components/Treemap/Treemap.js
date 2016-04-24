import d3 from 'd3-geo-projection';
import React, {Component, PropTypes} from 'react';

export default class TreeMap extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
  }
  componentDidMount() {
    this.draw();
  }

  getNodeClass(obj) {
    // TODO may need some changes to cater for various use cases
    const type = 'region';
    const code = obj.region;
    return 'node ' + type + '-' + code;
  }

  getNodeContet(obj) {
    let template = null;
    if (!obj.parent || obj.children) return null;

    const ratio = obj.value / obj.parent.value;

    if (ratio > 0.04 ) {
      template = '<div class="name name-1">' + obj.name + '</div><div class="number">'
                  + d3.format('%')(ratio) + ' | US$ ' + this.niceNum(obj.value, 0) + '</div>';
    } else if (ratio > 0.008 ) {
      template = '<div class="name name-2">' + obj.name + '</div><div class="number number-2">'
        + d3.format('%')(ratio) + ' | US$ ' + this.niceNum(obj.value, 0) + '</div>';
    } else if (ratio > 0.005 ) {
      template = '<div class="name name-3">' + obj.name + '</div>';
    } else if (ratio > 0.001 ) {
      template = '<div class="name name-4">' + obj.name + '</div>';
    }
    return template;
  }

  niceNum(input, precision) {
    // var numPrefix, humanPrefixes, numValue, roundedValue;
    if (input === 'N/A') return input;

    if (input < 1000) return d3.round(input, precision);
    // this is for input marked as 1k, 2m
    const numPrefix = d3.formatPrefix(input);
    const humanPrefixes = { k: 'k', M: 'm', G: 'bn', T: 'tr' };
    const numValue = numPrefix.scale(input);
    const roundedValue = d3.round(numValue, precision);
    return roundedValue + humanPrefixes[numPrefix.symbol];
  }

  treemap = d3.layout.treemap()
    .sticky(false)
    .sort((prev, current) => prev.value - current.value)
    .value(val => val.size);

  positionNode() {
    this.style({
      left: val => val.x + 'px',
      top: val => val.y + 'px',
      width: val => Math.max(0, val.valx - 0) + 'px',
      height: val => Math.max(0, val.valy - 0) + 'px'
    });
  }

  draw = () =>{
    // const colorScale = d3.scale.category20c();
    const root = d3.select(this.refs.treeMapHolder);
    // Make sure we have a clean slate
    root.selectAll('.node').remove();
    this.treeMapLayout = d3.select.datum(root).selectAll('.node')
      .data(this.treemap.nodes)
      .enter().append('div')
      .attr('class', this.getNodeClass)
      .call(this.positionNode)
      .html(this.getNodeContet);
  }
  render() {
    return (
      <section ref = "treeMapHolder" />
    );
  }
}
