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
    apiRequestMain: state.unbundling.apiRequestMain, // for creating apiRequestObj
    apiRequestComparison: state.unbundling.apiRequestComparison, //  for creating apiRequestObj for a comparison treemap
    selectOptions: state.unbundling.selectOptions,
    comparison: state.unbundling.comparisonData,
    // treeMapDepth: state.unbundling.treeMapDepth,
    chartCount: state.unbundling.chartCount // hack its change forces a full re-draw of the treemap
  }),
  dispatch => ({ actions: bindActionCreators({load, loadComparisonData, updateSelectOptions}, dispatch)})
)

export default class TreeMap extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    apiRequestMain: PropTypes.object.isRequired,
    apiRequestComparison: PropTypes.object,
    comparison: PropTypes.object,
    chartCount: PropTypes.number.isRequired,
    treeMapRefName: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    selectOptions: PropTypes.object.isRequired,
    // treeMapDepth: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    this.node = null; // d3 instance of a treemap node (the square box)
    this.treeMapHolder = null; // will contain d3 object of the treeMapHolder dom node
    // Hack i want to be able to mutate this.props.treeMapDepth with in the component by incrementing it but
    // i cant coz its readonly
    this.treeMapDepth = 0;
    // these class codes are
    // used in creating the classnames for different node squares
    this.nodeClassCodes = ['region', 'sector', 'bundle', 'channel'];
  }

  componentDidMount() {
    /* eslint-disable no-unused-expressions*/
    this.changeTreeMapDepthCount();
    this.props.treeMapRefName === 'treemap1' ? this.draw(this.props.data) : this.draw(this.props.comparison);
  }

  componentWillUpdate(nextProps) {
    nextProps.treeMapRefName === 'treemap1' ? this.draw(nextProps.data) : this.draw(nextProps.comparison);
  }

  getNodeClass = (obj) => {
    const type = this.nodeClassCodes[this.treeMapDepth];
    // if (this.treemapDepth) console.log('type not zero', type);
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
  changeTreeMapDepthCount = () => {
    // when we are comparing two maps
    const {chartCount, treeMapRefName, apiRequestComparison} = this.props;
    if (chartCount === 2 && treeMapRefName === 'treemap2') {
      this.treemapDepth = apiRequestComparison.match.length > 2 ? apiRequestComparison.match.length - 1 : 0;
      console.log('changed treemapDepth', this.treemapDepth );
    }
  }
  /**
   * nodeClickHandler: handles click events to treemap nodes
   * @param  {[object]} node
   */
  nodeClickHandler = (node) => {
    const {treeMapRefName, actions} = this.props;
    // chosing an appropriate load function so that we update the appropriate data
    const loadData = treeMapRefName === 'treemap1' ? actions.load : actions.loadComparisonData;
    this.updateSelectMenu(node);
    // building match and group objects for api request object
    const apiRequestObj = this.matchAndGroupAPIObjBuilder(node);
    // actions.updateAPIRequestObject(apiRequestObj);
    // globaly update apiRequestObj
    loadData(apiRequestObj);   // make request to API for new data
  }
  /**
   * creates api request object based on the clicked treemap node
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  matchAndGroupAPIObjBuilder = (node) => {
    const {apiRequestMain, apiRequestComparison, treeMapRefName} = this.props;
    // const depth = treeMapDepth;
    const {match, group} = treeMapRefName === 'treemap1' ? apiRequestMain : apiRequestComparison;
    if (node.type === 'country') {
      node['donor-recipient-type'] === 'recipient' ? match['id-to'] = node.id : match['id-from'] = node.id;
    } else {
      const category = this.nodeClassCodes[this.treeMapDepth];
      match[category] = node.id;
    }
    // const depth = treeMapDepth;
    if (node['donor-recipient-type'] !== 'recipient' && this.treeMapDepth < this.nodeClassCodes.length - 1) this.treeMapDepth ++;
    group._id = this.treeMapDepth ? '$' + this.nodeClassCodes[this.treeMapDepth] : '$id-from';
    return {match, group};
  }

  updateSelectMenu = (node) => {
    // assuming selected country
    let selectOptionType = null;
    if (!this.treeMapDepth) {
      selectOptionType = node['donor-recipient-type'] === 'recipient' ? 'id-to' : 'id-from';
    } else {
      selectOptionType = this.nodeClassCodes[this.treeMapDepth];
    }
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

  // TODO refactor function
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
      <section ref = {this.props.treeMapRefName} className={styles.treeMapHolder} />
    </div>
    );
  }
}
