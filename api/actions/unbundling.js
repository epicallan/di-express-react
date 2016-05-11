import {get, getFromRedis, saveInRedis} from '../utils/ApiClient';
import { DI_API } from '../config';

class UnbundlingAction {

  async getOptionsData() {
    const data = await getFromRedis('options');
    return new Promise((resolve) => resolve(data));
  }

  async getODAFromAPI({match, group}) {
    console.log('getting from API');
    // if not in cache make an api request
    if (!Number.isNaN(match.year)) match.year = parseInt(match.year, 10);
    const url = this.urlBuilder('oda', { match, group});
    return get(DI_API, url);
  }

  /**
   * carried function that takes in the request for new data (post request)
   * and waits for the payload to cache it into redis.
   * @param  {object} request
   *  @param  {object} request payload
   * @return {[type]}         [description]
   */

  cacheRequestPayload = (request) => (payload) => saveInRedis(JSON.stringify(request), payload);
  /**
   * getActiveLevelKey returns active metric eg aid to(id-to) or aid from(id-from)
   * This allows us to find out which data to enrich the raw odaData with.
   * @param  {[object]} got from request
   * @return {string}   id-to or id-from
   */
  getActiveLevelKey = (group) => group._id.split('$')[1];

  processODAData(odaData, activeData) {
    // fuse options entity data with the oda data
    return odaData.data.map( obj => {
      const entity = activeData.find(data => data.id === obj._id);
      obj.value = obj.total;
      return Object.assign({}, obj, entity);
    });
  }

  urlBuilder(endpoint, {match, group}) {
    const matchArgs = Object.assign({}, {'concept': 'oda'}, match);
    let url = `aggregate/${endpoint}?`;
    url += '&match=' + JSON.stringify(matchArgs) || '';
    url += '&group=' + JSON.stringify(group) || '';
    return url;
  }
}

export const unbundlingAction = new UnbundlingAction();


export default async function unbundling(req, params) {
  if (params[0] === 'options') return await unbundlingAction.getOptionsData();
  const optionsData = await unbundlingAction.getOptionsData();
  // if we have the payload for this request cached we return it
  let odaRaw = await getFromRedis(JSON.stringify(req.body));
  // get from API if not in cache
  if (!odaRaw) odaRaw = await unbundlingAction.getODAFromAPI(req.body);
  // caching request and payload
  if (odaRaw) unbundlingAction.cacheRequestPayload(req.body)(odaRaw);
  // let us find out whether we are look at data for countries that recieve aid or give AID
  const activeLevel = unbundlingAction.getActiveLevelKey(req.body.group);
  // let us enrich the various data rows/fields with their corresponding rich data
  const richLevelData = activeLevel ? optionsData[activeLevel] : optionsData['id-to'];
  // let us compose the data
  const data = unbundlingAction.processODAData(odaRaw, richLevelData);
  return {name: 'oda', children: data};
}
