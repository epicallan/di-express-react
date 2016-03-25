import React, {Component, PropTypes} from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import cx from 'classnames';

export default class Themes extends Component {
  static propTypes = {
    themes: PropTypes.array.isRequired,
    indicator: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired
  };

  render() {
    const styles = require('./Themes.scss');
    const menu = this.props.themes.map(
      item => (
        <NavItem
        key ={item._id}
        eventKey={item.default}
        title={item.name}>
        {item.name}
        </NavItem>
      )
    );
    return (
      <div className ="text-center">
        <Nav bsStyle="pills"
          activeKey={this.props.indicator} onSelect={this.props.clickHandler} className={cx(styles.themes, styles.main)}>
          {menu}
        </Nav>
        <Nav bsStyle="pills" id="override-sub" className={styles.sub}
          activeKey={this.props.indicator} onSelect={this.props.clickHandler} className={cx(styles.themes, styles.sub)}>
          <NavItem
          eventKey={this.props.indicator}
          title={this.props.indicator}>
          {this.props.indicator}
          </NavItem>
        </Nav>
      </div>
    );
  }
}
