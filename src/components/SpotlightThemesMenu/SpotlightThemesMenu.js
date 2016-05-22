import React, {Component, PropTypes} from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import cx from 'classnames';

export default class SpotlightThemesMenu extends Component {
  static propTypes = {
    themes: PropTypes.object.isRequired,
    indicator: PropTypes.string.isRequired,
    currentTheme: PropTypes.string.isRequired,
    loadData: PropTypes.func.isRequired
  };

  clickHandler = () => {
    const {loadData} = this.props;
    console.log(indicator);
    // dispatch action for new data on mouse event
    // loadData(`/spotlight/${indicator}`);
  }

  render() {
    const styles = require('./SpotlightThemesMenu.scss');
    const {currentTheme, indicator, themes} = this.props;
    const menu = Object.keys(themes).map(theme => {
      const mainTheme = themes[theme].main;
      return (
        <NavItem
        key ={mainTheme.id}
        eventKey={mainTheme.slug}
        title={mainTheme.name}>
        {mainTheme.name}
        </NavItem>
      );
    });
    return (
      <div className ="text-center">
        <Nav
          bsStyle="pills"
          activeKey={indicator}
          onSelect={this.clickHandler.bind(this)}
          className={cx(styles.themes, styles.main)}>
          {menu}
        </Nav>
        <Nav
          bsStyle="pills"
          className={cx(styles.themes, styles.sub)}>
          <NavItem
            eventKey={indicator}
            title={indicator}>
            {currentTheme}
          </NavItem>
        </Nav>
      </div>
    );
  }
}
