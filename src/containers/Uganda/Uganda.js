import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Maps } from 'components';

export default class Uganda extends Component {
  render() {
    return (
      <div className="container">
        <Helmet title="Spotlight on Uganda"/>
        <h1>Spotlight on Uganda</h1>
        <Maps />
      </div>
    );
  }
}
