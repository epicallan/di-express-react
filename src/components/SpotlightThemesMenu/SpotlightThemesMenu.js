import React, {Component, PropTypes} from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import cx from 'classnames';

export default class SpotlightThemesMenu extends Component {
  static propTypes = {
    themes: PropTypes.object.isRequired,
    indicator: PropTypes.string.isRequired,
    currentTheme: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired
  };

  // themeName = (themes, indicator) => themes.find(theme => theme.slug === this.props.indicator).name
  render() {
    const styles = require('./SpotlightThemesMenu.scss');
    const {currentTheme, indicator, clickHandler, themes} = this.props;
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
          onSelect={clickHandler}
          className={cx(styles.themes, styles.main)}>
          {menu}
        </Nav>
        <Nav
          bsStyle="pills"
          id="override-sub"
          className={styles.sub}
          className={cx(styles.themes, styles.sub)}>
          <NavItem
            eventKey={indicator}
            title={indicator}>
            {currentTheme.name}
          </NavItem>
        </Nav>
      </div>
    );
  }
}
