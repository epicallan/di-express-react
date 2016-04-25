import d3 from 'd3-geo-projection';
import React, {Component, PropTypes} from 'react';

/* eslint-disable id-length*/

export default class TreeMap extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
  }

  componentDidMount() {
    console.log('in TreeMap', this.props.data);
    this.draw();
  }

  getNodeClass(obj) {
    // TODO may need some changes to cater for various use cases
    const type = 'region';
    const code = obj.region;
    return 'node ' + type + '-' + code;
  }

  getNodeContent = (obj) => {
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
    // console.log('template', template);
    return template;
  }

  positionNode() {
    this.style({
      left: obj => obj.x + 'px',
      top: obj => obj.y + 'px',
      width: obj => Math.max(0, obj.dx - 0) + 'px',
      height: obj => Math.max(0, obj.dy - 0) + 'px',
    });
  }

  node = null;

  treeMapHolder = null;

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
    .sort((a, b) => a.value - b.value)
    .value(obj => obj.value);

  resize = (forced) => {
    // console.log('treeMapHolder: ', this.treeMapHolder);
    const parentWidth = this.treeMapHolder.node().parentNode.offsetWidth;
    // Treemap gets the size from it's parent, if it didn't change, then no need for resize
    if (forced !== true) return;
    const margin = {top: 50, right: 10, bottom: 10, left: 10};
    const width = parentWidth;
    let height = window.innerHeight - 200 || 340 - margin.top - margin.bottom;
    if (height > 550) height = 550;

    this.treeMapHolder
        .style({
          left: margin.left + 'px',
          top: margin.top + 'px',
          width: (width + margin.left + margin.right) + 'px',
          height: (height + margin.top + margin.bottom) + 'px'
        });

    this.treemap
        .size([width, height])
        .ratio(height / width * 0.9 * (1 + Math.sqrt(5)));

    this.node
        .data(this.treemap.nodes)
        .call(this.positionNode)
        .attr('class', this.getNodeClass)
        .html(this.getNodeContent);
  }

  draw = () => {
    // const colorScale = d3.scale.category20c();
    this.treeMapHolder = d3.select(this.refs.treeMapHolder);
    // Make sure we have a clean slate
    this.treeMapHolder.selectAll('.node').remove();
    this.node = this.treeMapHolder.datum(this.props.data).selectAll('.node')
      .data(this.treemap.nodes)
      .enter().append('div')
      .attr('class', this.getNodeClass)
      .call(this.positionNode)
      .html(this.getNodeContent);
    this.resize(true);
  }

  render() {
    const styles = require('./TreeMap.scss');
    return (
    <div className ={styles.treeContainer}>
      <section ref = "treeMapHolder" className="treeMapHolder" />
    </div>
    );
  }
}
