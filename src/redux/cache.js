
function flattenData(key, data) {
  const treemapData = data[key];
  if (!treemapData) return [];
  return treemapData.children[0].original;
}

export function storeInSessionStorage(action, store) {
  // there is mutation of the treemap data going in??
  // I need to investigate it could be a bug with my Redux set up
  // in light of that mutation we are going to do a small hack and also use it to our advantage
  if (__CLIENT__) {
    // store payload and api request
    sessionStorage.setItem(action.apiRequest, action.result); // storing current apiRequest and payload
    const mainData = flattenData('data', store);
    const comparisonData = flattenData('comparisonData', store);
    const newStore = Object.assign({}, store, {'data': mainData, comparisonData});
    sessionStorage(action.cacheKey, newStore); // storing previous store state
  }
}


export function getFromSessionStorage(key) {
  return sessionStorage.getItem(JSON.stringify(key));
}
