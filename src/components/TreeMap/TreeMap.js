import d3 from 'd3-geo-projection';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import styles from './TreeMap.scss';
import {bindActionCreators} from 'redux';
import {load, loadComparisonData, updateSelectOptions} from 'redux/modules/unbundling';


/* eslint-disable id-length*/
@connect(
  state => ({
    data: state.unbundling.data,
    selectOptions: state.unbundling.selectOptions,
    comparison: state.unbundling.comparisonData,
    chartCount: state.unbundling.chartCount // hack its change forces a full re-draw of the treemap
  }),
  dispatch => ({ actions: bindActionCreators({load, loadComparisonData, updateSelectOptions}, dispatch)})
)

export default class TreeMap extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    comparison: PropTypes.object,
    chartCount: PropTypes.number.isRequired,
    treeMapRefName: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    selectOptions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.node = null; // d3 instance of a treemap node (the square box)
    this.treeMapHolder = null; // will contain d3 object of the treeMapHolder dom node
    this.match = {'year': 2013}; // for creating api request
    this.group = {_id: '$id-to', total: {'$sum': '$value'}};// for creating api request
    this.nodeClassCode = '';
    this.treemapDepth = 0;
  }

  componentDidMount() {
    /* eslint-disable no-unused-expressions*/
    this.props.treeMapRefName === 'treemap1' ? this.draw(this.props.data) : this.draw(this.props.comparison);
  }

  componentWillUpdate(nextProps) {
    nextProps.treeMapRefName === 'treemap1' ? this.draw(nextProps.data) : this.draw(nextProps.comparison);
  }

  getNodeClass(obj) {
    const type = obj.type === 'country' ? 'region' : this.nodeClassCode;
    const code = obj.region || obj.id;
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
    return template;
  }
  /**
   * positionNode  positions treemap nodes
   * this function is called on each node by the d3 treemap function
   * @return {object}
   */
  positionNode() {
    this.style({
      left: obj => obj.x + 'px',
      top: obj => obj.y + 'px',
      width: obj => Math.max(0, obj.dx - 0) + 'px',
      height: obj => Math.max(0, obj.dy - 0) + 'px',
    });
  }

  nodeClickHandler = (node) => {
    // create new api request object based on current selection
    // const aidTypeField = node['donor-recipient-type'] === 'recipient' ? '$id-from' : '$id-to';
    // console.log(node);
    if (node.type !== undefined && node.type === 'country') {
      if ( node['donor-recipient-type'] === 'recipient') {
        this.match['id-to'] = node.id;
        this.group._id = '$id-from';
      } else {
        this.match['id-from'] = node.id;
        this.nodeClassCode = 'sector';
        this.group._id = '$' + this.nodeClassCode;
      }
      this.treemapDepth ++;
    } else {
      if (this.treemapDepth === 2) {
        this.match.sector = node.id;
        this.nodeClassCode = 'bundle';
        this.treemapDepth ++;
      } else {
        this.match.bundle = node.id;
        this.nodeClassCode = 'channel';
      }
      this.group._id = '$' + this.nodeClassCode;
    }
    // make request
    const {treeMapRefName, actions} = this.props;
    // chosing an appropriate load function so that we update the appropriate data
    const loadData = treeMapRefName === 'treemap1' ? actions.load : actions.loadComparisonData;
    loadData({match: this.match, group: this.group});
    this.updateSelectMenu(node);
  }

  updateSelectMenu = (node) => {
    // assuming selected country
    const selectOptionType = node['donor-recipient-type'] === 'recipient' ? 'id-to' : 'id-from';
    // updating the menu select options
    this.props.actions.updateSelectOptions({
      [selectOptionType]: { niceName: node.name, value: node.id, visible: false},
    });
  }

  niceNum(input, precision) {
    if (input === 'N/A') return input;

    if (input < 1000) return d3.round(input, precision);
    // this is for input marked as 1k, 2m
    const numPrefix = d3.formatPrefix(input);
    const humanPrefixes = { k: 'k', M: 'm', G: 'bn', T: 'tr' };
    const numValue = numPrefix.scale(input);
    const roundedValue = d3.round(numValue, precision);
    return roundedValue + humanPrefixes[numPrefix.symbol];
  }

  // creating d3 treemap object
  treemap = d3.layout.treemap()
    .sticky(false)
    .sort((a, b) => a.value - b.value)
    .value(obj => obj.value);

  // TODO refactor function or rename
  resize = (forced) => {
    const parentWidth = this.treeMapHolder.node().parentNode.offsetWidth;
    // Treemap gets the size from it's parent, if it didn't change, then no need for resize
    if (forced !== true) return;
    const margin = {top: 50, right: 20, bottom: 0, left: 20};
    const width = parentWidth;
    let height = window.innerHeight - 200 || 340 - margin.top - margin.bottom;
    if (height > 450) height = 450;

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

    this.node // May need to be refactored TODO
        .data(this.treemap.nodes)
        .call(this.positionNode)
        .on('click', this.nodeClickHandler)
        .attr('class', this.getNodeClass)
        .html(this.getNodeContent);
  }

  draw = (data) => {
    this.treeMapHolder = d3.select(this.refs[this.props.treeMapRefName]);
    // Make sure we have a clean slate
    this.treeMapHolder.selectAll('.node').remove();
    this.node = this.treeMapHolder.datum(data).selectAll('.node') // TODO needs some refactoring
      .data(this.treemap.nodes)
      .enter().append('div');
    this.resize(true);  // completes setting up the treemap node and treemap layout settings
  }

  render() {
    return (
    <div className ={styles.treeContainer}>
      <section ref = {this.props.treeMapRefName} className="treeMapHolder" />
    </div>
    );
  }
}
