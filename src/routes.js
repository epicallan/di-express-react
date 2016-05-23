import React from 'react';
import {IndexRoute, Route, Redirect} from 'react-router';
import {
    App,
    Uganda,
    NotFound,
    About,
    Profile,
    Unbundling
  } from 'containers';

export default () => {
  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      <Redirect from="uganda" to="/" />
      <Redirect from="district" to="/" />
      { /* Home (main) route */ }
      <IndexRoute component={Uganda} />
      <Route path="district/:name" component={Profile}/>
      <Route path="unbundling" component={Unbundling}/>
      <Route path="about" component={About}/>
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
