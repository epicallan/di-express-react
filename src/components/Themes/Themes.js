import React, {PropTypes} from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import cx from 'classnames';

function handleSelect(selectedKey) {
  alert('selected ' + selectedKey);
}

const Themes = (props) => {
  const styles = require('./Themes.scss');
  const menu = props.themes.map(
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
        activeKey={props.indicator} onSelect={handleSelect} className={cx(styles.themes, styles.main)}>
        {menu}
      </Nav>
      <Nav bsStyle="pills" className={styles.sub}
        activeKey={props.indicator} onSelect={handleSelect} className={cx(styles.themes, styles.sub)}>
        <NavItem
        title={props.indicator}>
        {props.indicator}
        </NavItem>
      </Nav>
    </div>
  );
};

Themes.propTypes = {
  themes: PropTypes.array.isRequired,
  indicator: PropTypes.string.isRequired
};
export default Themes;
