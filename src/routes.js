import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {
    App,
    // Home,
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
      { /* Home (main) route */ }
      <IndexRoute component={Uganda}>
          <Route path="district/:name" component={Profile}/>
      </IndexRoute>
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
