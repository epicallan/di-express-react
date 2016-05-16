import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import cx from 'classnames';
/* eslint-disable no-unused-expressions*/
@connect(
  state => ({
    sector: state.unbundling.sector,
    bundle: state.unbundling.bundle,
    channel: state.unbundling.channel,
    'id-to': state.unbundling['id-to'], // aid to countries
    'id-from': state.unbundling['id-from'] // aid from countries
  })
)
export default class UnbundlingMenu extends Component {
  static propTypes = {
    sector: PropTypes.array.isRequired,
    bundle: PropTypes.array.isRequired,
    channel: PropTypes.array.isRequired,
    'id-to': PropTypes.array.isRequired,
    'id-from': PropTypes.array.isRequired,
    menuType: PropTypes.number.isRequired,
    selectOptions: PropTypes.object.isRequired,
    loadData: PropTypes.func.isRequired,
    updateSelectOptions: PropTypes.func.isRequired,
    apiRequest: PropTypes.object.isRequired,
  };
  levels = ['id-to', 'id-from', 'sector', 'bundle', 'channel'];
  /**
   * levelOptionsVisibility:  set selectOptions visible or unvisible depending on their current display state
   * @param  {[type]} level [description]
   * @return {[type]}       [description]
   */
  levelOptionsVisibility = (levelName) => {
    const levels = [...this.levels, 'year'];
    // hide all select options
    // and show only current selection
    levels.forEach(key => {
      // const options = selectOptionsObj[key];
      const refName = `${key}-${this.props.menuType}`; // TODO can be refactored : element whose visibility we are affectig
      key === levelName ? this.refs[refName].style.display = 'block' : this.refs[refName].style.display = 'none';
    });
  }

  closeOptionContainer = (levelName) => {
    const refName = `${levelName}-${this.props.menuType}`;
    this.refs[refName].style.display = 'none';
  }

  niceNamesForSelectOptions = (id, levelName) => {
    const level = this.props[levelName];
    if (levelName === 'year' || id === 'All') return id;
    const obj = level.find(item => item.id === id );
    return obj.name;
  }

  optionsChangeHandler(levelName, event) {
    const { apiRequest, selectOptions, updateSelectOptions, loadData} = this.props;
    const {match, group} = apiRequest;
    // const selectOptionsObj = this.getSelectOptions();
    // if the selection is all for an option then remove that option from the api request
    const stateObj = selectOptions[levelName]; // selectOptions object being affected
    if (levelName !== 'year') stateObj.niceName = this.niceNamesForSelectOptions(event.target.value, levelName);
    stateObj.value = event.target.value;
    // console.log({...selectOptionsObj, [levelName]: stateObj})
    updateSelectOptions({...selectOptions, [levelName]: stateObj});
    // updating API request object
    event.target.value === 'All' ? delete match[levelName] : match[levelName] = event.target.value;
    // make API request Object and make request for new data
    const apiRequestObj = {match, group};
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
    // console.log('selectOptions: ', selectOptionsObj );
    const settings = this.levels.map((key, index) => {
      const level = this.props[key];
      if (!Array.isArray(level)) return false;

      const levelOptions = level.map(item => (
          <option key = {item._id} value = {item.id}> {item.name} </option>
        )
      );
      const levelName = this.niceNamesForMenu(key);
      const refName = `${key}-${this.props.menuType}`; // we want to have unique refnames coz we duplicate this component
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
    const refName = `year-${this.props.menuType}`;
    return (
      <section className ={cx('treemap--settings-holder', 'col-md-12', styles.toolBar)}>
        <div className="settings--item selected">
          <span className={styles.spanMain} onClick={this.levelOptionsVisibility.bind(this, 'year')} >ODA in <strong> {this.props.selectOptions.year.value}</strong></span>
          <div className="select-holder" ref={refName}>
            <i className="ss-delete close" onClick={this.closeOptionContainer.bind(this, 'year')}></i>
            <i>Years</i>
            <div className="select">
              <select className="form-control"
                value = {this.props.selectOptions.year.value} onChange = {this.optionsChangeHandler.bind(this, 'year')} >
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
