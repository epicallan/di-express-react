function getCachedPayload(apiRequest) {
  if (__SERVER__ || !apiRequest) return false;
  const cached = sessionStorage.getItem(JSON.stringify(apiRequest));
  // console.log('cached', cached);
  if (!cached) return false;
  return new Promise((resolve) => resolve(JSON.parse(cached)));
}
export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      // console.log(`action`, action);
      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST}); // distpatch for loading
      const cached = getCachedPayload(action.apiRequest);
      const actionPromise = cached || promise(client); // gets data either from sessionStorage or API
      // check in our cache
      actionPromise.then(
        // sessionStorage.setItem(JSON.stringify(action.apiRequestObj), JSON.stringify(action.result)); store in cache
        (result) => next({...rest, result, type: SUCCESS}),
        (error) => next({...rest, error, type: FAILURE})
      ).catch((error)=> {
        console.error('MIDDLEWARE ERROR:', error);
        next({...rest, error, type: FAILURE});
      });

      return actionPromise;
    };
  };
}
