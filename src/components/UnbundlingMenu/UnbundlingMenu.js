import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {load} from 'redux/modules/unbundling';
import cx from 'classnames';

@connect(
  state => ({
    sector: state.unbundling.sector,
    bundle: state.unbundling.bundle,
    channel: state.unbundling.channel,
    'id-to': state.unbundling['id-to'], // aid to
    'id-from': state.unbundling['id-from'] // aid from
  }),
  dispatch => ({ load: bindActionCreators(load, dispatch)})
)
export default class UnbundlingMenu extends Component {
  static propTypes = {
    sector: PropTypes.array.isRequired,
    bundle: PropTypes.array.isRequired,
    channel: PropTypes.array.isRequired,
    'id-to': PropTypes.array.isRequired,
    'id-from': PropTypes.array.isRequired,
    load: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      match: {'year': 2013},
      group: {_id: '$id-to', total: {'$sum': '$value'}},
      year: 2013, // mantaining select options state
      sector: 'All',
      bundle: 'All',
      'id-to': 'All',
      'id-from': 'All'
    };
  }
  /**
   * levelOptionsVisibility:  set selectOptions visible or unvisible depending on their current display state
   * @param  {[type]} level [description]
   * @return {[type]}       [description]
   */
  levelOptionsVisibility(level) {
    // hide all initiallly
    const selectElms = document.getElementsByClassName('select-holder');
    Array.prototype.forEach.call(selectElms, elm => elm.style.display = 'none');
    // show the element in question
    const activeOptions = document.getElementById(level);
    // if we selecting the active option, we probably want it hidden
    // so reassign its className property removing the active class
    if (activeOptions.className.includes('active')) {
      activeOptions.className = 'select-holder';
      return false;
    }
    // set option container class active and show it for the options container we want to show
    activeOptions.className += ' active';
    activeOptions.style.display = 'block';
  }

  closeOptionContainer(level) {
    const activeOptions = document.getElementById(level);
    // reassign class names
    activeOptions.className = 'select-holder';
    activeOptions.style.display = 'block';
  }
  niceNamesForSelectOptions = (name, levelName) => {
    const level = this.props[levelName];
    if (levelName === 'year' || name === 'All') return name;
    const obj = level.find(item => item.id === name );
    return obj.name;
  }
  optionsChangeHandler(level, event) {
    /* eslint-disable no-unused-expressions*/
    event.target.value === 'all' ? delete this.state.match[level] : this.state.match[level] = event.target.value;
    this.setState({[level]: this.niceNamesForSelectOptions(event.target.value, level)});
    // make API call
    const args = {
      match: this.state.match,
      group: this.state.group
    };
    console.log('state ', this.state);
    console.log('args ', args);
    this.props.load(args);
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
      // console.log('state', this.state);
      const niceLabel = this.niceNamesForMenu(key);
      return (
        <li key = {key + '-' + index} className="settings--item settings--sort_item">
          <span className="drag-handle" onClick={this.levelOptionsVisibility.bind(this, key)}>
            <span className="settings--item-level-name">{niceLabel}</span>
            <strong>{this.state[key]}</strong>
          </span>
          <div className="select-holder" ref={key} id ={key}>
            <i className="ss-delete close" onClick={this.closeOptionContainer.bind(this, key)}></i>
            <i>{niceLabel}</i>
            <div className="select">
              <select className="form-control" value = {this.state[key]} onChange = {this.optionsChangeHandler.bind(this, key)} >
                <option value="All">all</option>
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
    return (
      <section className ={cx('treemap--settings-holder', 'col-md-12', styles.toolBar)}>
        <div className="settings--item selected">
          <span className={styles.spanMain} onClick={this.levelOptionsVisibility.bind(this, 'year')} >ODA in <strong> {this.state.year}</strong></span>
          <div className="select-holder" ref="year" id = "year">
            <i className="ss-delete close" onClick={this.closeOptionContainer.bind(this, 'year')}></i>
            <i>Years</i>
            <div className="select">
              <select className="form-control" value = {this.state.year} onChange = {this.optionsChangeHandler.bind(this, 'year')} >
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
