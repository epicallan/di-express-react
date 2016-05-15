import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {load, loadComparisonData, updateSelectOptions} from 'redux/modules/unbundling';
import cx from 'classnames';

@connect(
  state => ({
    sector: state.unbundling.sector,
    bundle: state.unbundling.bundle,
    channel: state.unbundling.channel,
    apiRequestMain: state.unbundling.apiRequestMain, // for creating apiRequestObj
    apiRequestComparison: state.unbundling.apiRequestComparison, //  for creating apiRequestObj for a comparison treemap
    // mantaining state across selectOptions import when the treemap nodes are
    // clicked and we need to update the menu to reflect that
    selectOptions: state.unbundling.selectOptions,
    'id-to': state.unbundling['id-to'], // aid to countries
    'id-from': state.unbundling['id-from'] // aid from countries
  }),
  dispatch => ({ actions: bindActionCreators({load, loadComparisonData, updateSelectOptions}, dispatch)})
)
export default class UnbundlingMenu extends Component {
  static propTypes = {
    sector: PropTypes.array.isRequired,
    bundle: PropTypes.array.isRequired,
    channel: PropTypes.array.isRequired,
    apiRequestMain: PropTypes.object.isRequired,
    apiRequestComparison: PropTypes.object,
    selectOptions: PropTypes.object,
    'id-to': PropTypes.array.isRequired,
    'id-from': PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    chart: PropTypes.number
  };
  // component state
  state = {
    compareBtnLable: 'compare'
  };
  /**
   * levelOptionsVisibility:  set selectOptions visible or unvisible depending on their current display state
   * @param  {[type]} level [description]
   * @return {[type]}       [description]
   */
  levelOptionsVisibility(levelName) {
    // hide all select options
    // and show only current selection
    const selectOptions = this.props.selectOptions;
    Object.keys(selectOptions).forEach(key => {
      const options = selectOptions[key];
      const refName = `${key}-${this.props.chart}`;
      if (key === levelName) {
        options.visible = true;
        this.refs[refName].style.display = 'block';
      } else {
        options.visible = false;
        this.refs[refName].style.display = 'none';
      }
    });
    this.props.actions.updateSelectOptions(selectOptions);
    // console.log(this.state);
  }

  closeOptionContainer(levelName) {
    // hide object
    const refName = `${levelName}-${this.props.chart}`;
    this.refs[refName].style.display = 'none';
    // change its state
    const activeOptions = this.props.selectOptions[levelName];
    activeOptions.visible = false;
    const selectOptions = Object.assign({}, this.props.selectOptions, {[levelName]: activeOptions});
    this.setState({'selectOptions': selectOptions});
  }

  niceNamesForSelectOptions = (id, levelName) => {
    const level = this.props[levelName];
    if (levelName === 'year' || id === 'All') return id;
    const obj = level.find(item => item.id === id );
    return obj.name;
  }

  optionsChangeHandler(levelName, event) {
    const {actions, chart, apiRequestMain, apiRequestComparison} = this.props;
    // chosing what global request object to work
    const {match, group} = chart === 1 ? apiRequestMain : apiRequestComparison;
    /* eslint-disable no-unused-expressions*/
    // if the selection is all for an option then remove that option from the api request
    const stateObj = this.props.selectOptions[levelName]; // selectOptions object being affected
    if (levelName !== 'year') stateObj.niceName = this.niceNamesForSelectOptions(event.target.value, levelName);
    stateObj.value = event.target.value;
    const selectOptions = Object.assign({}, this.props.selectOptions, {[levelName]: stateObj});
    this.props.actions.updateSelectOptions(selectOptions);
    // updating API request object
    event.target.value === 'All' ? delete match[levelName] : match[levelName] = event.target.value;
    // make API request Object and make request for new data
    const apiRequestObj = {match, group};
    const loadData = chart === 1 ? actions.load : actions.loadComparisonData;
    loadData(apiRequestObj);
  }
  /**
   * this function is just a helper function to return 'to' or 'from' from
   * the id-to and id-from menu lable names
   * @param  {string} label [description]
   * @return {string}       [description]
   */
  niceNamesForMenu = (label) => {
    const splitLabel = label.split('-');
    const nice = splitLabel.length > 1 ? splitLabel[1] : label;
    return nice;
  }

  createLevelSettings = () => {
    const settings = Object.keys(this.props).map((key, index) => {
      const level = this.props[key];
      if (!Array.isArray(level)) return false;

      const levelOptions = level.map(item => (
          <option key = {item._id} value = {item.id}> {item.name} </option>
        )
      );
      const levelName = this.niceNamesForMenu(key);
      const refName = `${key}-${this.props.chart}`; // we want to have unique refnames coz we duplicate this component
      return (
        <li key = {key + '-' + index} className="settings--item settings--sort_item">
          <span className="drag-handle" onClick={this.levelOptionsVisibility.bind(this, key)}>
            <span className="settings--item-level-name">{levelName}</span>
            <strong>{this.props.selectOptions[key].niceName}</strong>
          </span>
          <div className="select-holder" ref={refName}>
            <i className="ss-delete close" onClick={this.closeOptionContainer.bind(this, key)}></i>
            <i>{levelName}</i>
            <div className="select">
              <select className="form-control" value = {this.props.selectOptions[key].value}
                onChange = {this.optionsChangeHandler.bind(this, key)} >
                <option value="All">All</option>
                {levelOptions}
              </select>
            </div>
          </div>
        </li>
      );
    });
    return settings;
  }

  render() {
    const styles = require('./UnbundlingMenu.scss');
    const refName = `year-${this.props.chart}`;
    return (
      <section className ={cx('treemap--settings-holder', 'col-md-12', styles.toolBar)}>
        <div className="settings--item selected">
          <span className={styles.spanMain} onClick={this.levelOptionsVisibility.bind(this, 'year')} >ODA in <strong> {this.props.selectOptions.year.value}</strong></span>
          <div className="select-holder" ref={refName}>
            <i className="ss-delete close" onClick={this.closeOptionContainer.bind(this, 'year')}></i>
            <i>Years</i>
            <div className="select">
              <select className="form-control" value = {this.props.selectOptions.year.value} onChange = {this.optionsChangeHandler.bind(this, 'year')} >
                  {/* TODO refactor */ }
                  <option value="2013">2013</option>
                  <option value="2012">2012</option>
                  <option value="2011">2011</option>
                  <option value="2010">2010</option>
                  <option value="2009">2009</option>
                  <option value="2008">2008</option>
                  <option value="2007">2007</option>
                  <option value="2006">2006</option>
              </select>
          </div>
        </div>
          <ul>
            {this.createLevelSettings()}
          </ul>
        </div>
      </section>
    );
  }
}
