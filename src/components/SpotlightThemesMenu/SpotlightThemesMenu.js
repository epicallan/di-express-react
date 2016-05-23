import React, {Component, PropTypes} from 'react';
import {Nav, NavItem, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import cx from 'classnames';

export default class SpotlightThemesMenu extends Component {
  static propTypes = {
    themes: PropTypes.object.isRequired,
    indicator: PropTypes.string.isRequired,
    currentTheme: PropTypes.string.isRequired,
    loadData: PropTypes.func.isRequired
  };

  mainThemesClickHandler = (event) => {
    const {loadData} = this.props;
    // dispatch action for new data on mouse event
    loadData(`/spotlight/${event.slug}`, event.id);
  }

  mainMenuItems = (themes) => {
    return Object.keys(themes).map(theme => {
      const mainTheme = themes[theme].main;
      return (
        <NavItem
        key ={mainTheme.id}
        eventKey={mainTheme}
        title={mainTheme.name}>
        {mainTheme.name}
        </NavItem>
      );
    });
  }

  themeIndicatorsClickHandler = (indicator) => {
    const {loadData, currentTheme} = this.props;
    // dispatch action for new data on mouse event
    loadData(`/spotlight/${indicator}`, currentTheme);
  }

  subMenuItems = (themes, currentTheme) => {
    const indicators = themes[currentTheme].indicators;
    return indicators.map(theme => {
      return (
        <MenuItem
        key ={theme.id}
        eventKey={theme.slug}
        title={theme.name}>
        {theme.name}
      </MenuItem>
      );
    });
  }
  render() {
    const styles = require('./SpotlightThemesMenu.scss');
    const {indicator, themes, currentTheme} = this.props;
    const mainMenu = this.mainMenuItems(themes);
    const subMenu = this.subMenuItems(themes, currentTheme);
    return (
      <div className ="text-center">
        <Nav
          bsStyle="pills"
          activeKey={indicator}
          onSelect={this.mainThemesClickHandler}
          className={cx(styles.themes, styles.main)}>
          {mainMenu}
        </Nav>
        <ButtonToolbar>
          <DropdownButton
            bsStyle= "default"
            title={indicator}
            activekey={indicator}
            id = {currentTheme}
            className={cx(styles.themes, styles.sub)}
            onSelect={this.themeIndicatorsClickHandler}
            >
            {subMenu}
          </DropdownButton>
        </ButtonToolbar>
      </div>
    );
  }
}
