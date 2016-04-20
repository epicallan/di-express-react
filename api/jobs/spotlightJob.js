import {get, saveInRedis} from '../utils/ApiClient';
import {DI_API, CMS_API} from '../config';
/**
 * getSpotlightBaseData: this functions gets data used in the spotlight maps that
 * doesn't change for each new request for data.
 * @return {object}
 */
async function getSpotlightBaseData() {
  const promises = [
    get(DI_API, 'reference/colorRamp'),
    get(CMS_API, 'api/indicator/?format=json'),
    get(DI_API, 'reference/uganda-district-entity')
  ];
  return Promise.all(promises);
}

/**
 * saveOptionsData saves all the various options data
 * this is the data used in coming up with the unbundling aid dropdowns/options
 * its also used in formulating requests for data
 * @return {obj}
 */
async function saveData() {
  const data = await getSpotlightBaseData();
  return saveInRedis('spotlight', {
    colorRamp: data[0],
    themes: data[1],
    etities: data[2]
  });
}
/**
 * sychronised the redis jobs so that i can close the client when they are done
 */
export default () => {
  saveData();
};
