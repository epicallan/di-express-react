import React from 'react';
import {IndexRoute, Route} from 'react-router';
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
      { /* Home (main) route */ }
      <IndexRoute component={Uganda} />
      { /* TODO  These should be route re-directs */ }
      <Route path="district" component={Uganda}/>
      <Route path="uganda" component={Uganda}/>
      <Route path="district/:name" component={Profile}/>
      { /* TODO SEO change address bar as indicator changes  */ }
      <Route path="indicator/:name" component={Uganda}/>
      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
