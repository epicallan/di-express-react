import React from 'react';
import {IndexRoute, Route, Redirect} from 'react-router';
import {
    App,
    Uganda,
    NotFound,
    Profile,
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
      { /* TODO SEO change address bar as indicator changes  */ }
      <Route path="indicator/:name" component={Uganda}/>
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
