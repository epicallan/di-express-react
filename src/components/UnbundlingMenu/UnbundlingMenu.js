import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import cx from 'classnames';

@connect(
  state => ({
    sector: state.unbundling.sector,
    bundle: state.unbundling.bundle,
    channel: state.unbundling.channel,
    aidTo: state.unbundling['id-to'],
    aidFrom: state.unbundling['id-from']
  })
)
export default class UnbundlingMenu extends Component {
  static propTypes = {
    sector: PropTypes.array.isRequired,
    bundle: PropTypes.array.isRequired,
    channel: PropTypes.array.isRequired,
    aidTo: PropTypes.array.isRequired,
    aidFrom: PropTypes.array.isRequired
  };
  /**
   * levelOptionsVisibility:  set selectOptions visible or unvisible depending on their current display state
   * @param  {[type]} level [description]
   * @return {[type]}       [description]
   */
  levelOptionsVisibility(level) {
    console.log(level);
    const selectOptions = this.refs[level];
    console.log(selectOptions);
    /* eslint-disable no-unused-expressions*/
    selectOptions.offsetHeight ? selectOptions.style.display = 'block'
    : selectOptions.style.display = 'none';
  }

  createLevelSettings = () => {
    const settings = Object.keys(this.props).map((key, index) => {
      const level = this.props[key];
      if (!Array.isArray(level)) return false;

      const levelOptions = level.map(item => (
          <option key = {item._id} value = {item.id}> {item.name} </option>
        )
      );

      return (
        <li key = {key + '-' + index} className="settings--item settings--sort_item">
          <span className="drag-handle" onClick={this.levelOptionsVisibility.bind(this, key)}>
            <span className="settings--item-level-name">{key}</span>
            <strong>All</strong>
          </span>
          <div className="select-holder" ref={key}>
            <i className="ss-delete close"></i>
            <i>{key}</i>
            <div className="select">
              <select className="form-control">
                <option value="">all</option>
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
          <span className={styles.spanMain}>ODA in <strong> 2013</strong></span>
          <div className="select-holder">
            <i className="ss-delete close"></i>
            <i>Select year</i>
            <div className="select">
              <select className="form-control" >
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
