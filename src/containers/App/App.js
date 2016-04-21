import React, { Component, PropTypes } from 'react';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import config from '../../config';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const styles = require('./App.scss');
    const logoImage = require('./logo.png');
    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/">
                <img className={styles.logo} src={logoImage}/>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar>
              <LinkContainer to="/uganda">
                <NavItem eventKey={1}>Spotlight on Uganda</NavItem>
              </LinkContainer>
            </Nav>
            <Nav navbar pullRight>
              <LinkContainer to="/unbundling">
                <NavItem eventKey={2}>Unbundling Aid</NavItem>
              </LinkContainer>
              <LinkContainer to="/uganda">
                <NavItem eventKey={3}>DOWNLOAD DATA</NavItem>
              </LinkContainer>
              <LinkContainer to="/uganda">
                <NavItem eventKey={4}>ABOUT</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <footer clasName="footer navbar-fixed-bottom" style={{display: 'none'}}>
          <div className="container">
            <div className="well text-center">
              <p>Footer goes here</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
