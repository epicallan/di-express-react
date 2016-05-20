
/**
 * flattenData there is data mutation going on with the data used to draw the treemap
 * these data mutations cause the resulting data to self nest or become cyclic with parent
 * data being added to each row/entry.
 * @param  {object} treemapData
 * @return {object}
 */
function flattenData(treemapData) {
  if (!treemapData || !treemapData.children) return treemapData;
  const children = treemapData.children.map(obj => {
    delete obj.parent;
    return obj;
  });
  return {
    name: treemapData.name,
    children
  };
}
// TODO limit how many objects we can cache
export function storeInSessionStorage(action, store) {
  // there is mutation of the treemap data going on??
  // I need to investigate it could be a bug with my Redux set up
  // in light of that mutation we are going to do a small hack and also use it to our advantage
  if (__CLIENT__) {
    // store payload and api request
    // console.log(action.apiRequest, action.result);
    /* const currentPayload = flattenData(action.result);
    sessionStorage.setItem(JSON.stringify(action.apiRequest), JSON.stringify(currentPayload)); // storing current apiRequest and
    */
    // previous state data
    const mainData = flattenData(store.data);
    const comparisonData = flattenData(store.comparisonData);
    const previousStoreState = Object.assign({}, store, {'data': mainData, comparisonData});
    sessionStorage.setItem(JSON.stringify(action.cacheKey), JSON.stringify(previousStoreState)); // storing previous store state
  }
}

export function cacheSpotlightData(action) {
  if (__CLIENT__) {
    // store payload and api request
    // check for number of keys
    sessionStorage.setItem(JSON.stringify(action.apiRequest), JSON.stringify(action.result));
  }
}

export function getFromSessionStorage(key) {
  const cache = sessionStorage.getItem(JSON.stringify(key));
  return JSON.parse(cache);
}
